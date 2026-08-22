"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { createSnapTransaction } from "@/lib/midtrans";
import { expireStaleBookings } from "@/lib/booking-expiry";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  whatsappNumber: z.string().min(9, "Nomor WhatsApp tidak valid (minimal 9 digit)"),
  visitDate: z.string().min(1, "Tanggal kunjungan wajib dipilih"),
  tickets: z.array(
    z.object({
      ticketId: z.string().min(1),
      quantity: z.number().int().min(0),
    })
  ),
  selectedGazeboId: z.string().nullable().optional(),
});

export type CreateBookingInput = z.infer<typeof bookingSchema>;

export async function getAvailableGazebosForDate(dateString: string) {
  try {
    await expireStaleBookings();

    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      return { success: false, errorMsg: "Tanggal kunjungan tidak valid." };
    }

    // Set time to start and end of day in UTC/local
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    // Find bookings for target date that are PAID or active PENDING
    const reservedItems = await prisma.bookingItem.findMany({
      where: {
        itemType: "GAZEBO",
        gazeboId: { not: null },
        booking: {
          visitDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            in: ["PAID", "PENDING", "COMPLETED"],
          },
        },
      },
      select: { gazeboId: true },
    });

    const reservedGazeboIds = new Set(reservedItems.map((item) => item.gazeboId));

    const allGazebos = await prisma.gazebo.findMany({
      where: { isActive: true },
      orderBy: { code: "asc" },
    });

    const gazebosWithAvailability = allGazebos.map((gzb) => ({
      ...gzb,
      isAvailable: !reservedGazeboIds.has(gzb.id),
    }));

    return { success: true, gazebos: gazebosWithAvailability };
  } catch (error: any) {
    return { success: false, errorMsg: "Gagal memuat ketersediaan gazebo." };
  }
}

export async function createBooking(input: CreateBookingInput) {
  try {
    await expireStaleBookings();

    const validation = bookingSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon lengkapi seluruh data form dengan benar." };
    }

    const { customerName, whatsappNumber, visitDate: dateStr, tickets: ticketInputs, selectedGazeboId } = validation.data;

    const visitDate = new Date(dateStr);
    if (isNaN(visitDate.getTime())) {
      return { success: false, errorMsg: "Tanggal kunjungan tidak valid." };
    }

    // 1. Filter tickets with quantity > 0
    const activeTicketRequests = ticketInputs.filter((t) => t.quantity > 0);
    if (activeTicketRequests.length === 0) {
      return { success: false, errorMsg: "Mohon pilih minimal 1 tiket masuk." };
    }

    // 2. Execute within DB Transaction for double-booking protection & price recomputation
    const result = await prisma.$transaction(async (tx) => {
      // Recompute ticket prices from DB
      const ticketIds = activeTicketRequests.map((t) => t.ticketId);
      const dbTickets = await tx.ticket.findMany({
        where: { id: { in: ticketIds }, isActive: true },
      });

      let calculatedTotal = 0;
      const bookingItemsToCreate = [];

      for (const req of activeTicketRequests) {
        const dbTicket = dbTickets.find((t) => t.id === req.ticketId);
        if (!dbTicket) {
          throw new Error(`Tiket tidak ditemukan atau sudah nonaktif.`);
        }

        const subtotal = dbTicket.price * req.quantity;
        calculatedTotal += subtotal;

        bookingItemsToCreate.push({
          itemType: "TICKET" as const,
          itemId: dbTicket.id,
          itemName: dbTicket.name,
          quantity: req.quantity,
          unitPrice: dbTicket.price,
          subtotal,
        });
      }

      // Recompute gazebo price & check double-booking if gazebo is selected
      if (selectedGazeboId) {
        const startOfDay = new Date(new Date(visitDate).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(visitDate).setHours(23, 59, 59, 999));

        // Double-booking DB check
        const existingGazeboBooking = await tx.bookingItem.findFirst({
          where: {
            itemType: "GAZEBO",
            gazeboId: selectedGazeboId,
            booking: {
              visitDate: {
                gte: startOfDay,
                lte: endOfDay,
              },
              status: {
                in: ["PAID", "PENDING", "COMPLETED"],
              },
            },
          },
          include: { booking: true },
        });

        if (existingGazeboBooking) {
          throw new Error("Gazebo yang Anda pilih sudah dipesan oleh pengunjung lain pada tanggal tersebut. Silakan pilih gazebo lain.");
        }

        const dbGazebo = await tx.gazebo.findUnique({
          where: { id: selectedGazeboId, isActive: true },
        });

        if (!dbGazebo) {
          throw new Error("Gazebo tidak ditemukan atau sedang nonaktif.");
        }

        const gazeboSubtotal = dbGazebo.price * 1;
        calculatedTotal += gazeboSubtotal;

        bookingItemsToCreate.push({
          itemType: "GAZEBO" as const,
          itemId: dbGazebo.id,
          itemName: `${dbGazebo.name} (${dbGazebo.code})`,
          quantity: 1,
          unitPrice: dbGazebo.price,
          subtotal: gazeboSubtotal,
          gazeboId: dbGazebo.id,
        });
      }

      // Generate unique reference code: RE-YYYYMMDD-XXXX
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
      const referenceCode = `RE-${datePart}-${randomSuffix}`;

      // Expiry time: 24 hours from creation
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Create Booking record
      const newBooking = await tx.booking.create({
        data: {
          referenceCode,
          customerName,
          whatsappNumber,
          visitDate,
          status: "PENDING",
          totalPrice: calculatedTotal,
          expiresAt,
          items: {
            create: bookingItemsToCreate,
          },
        },
      });

      return newBooking;
    });

    revalidatePath("/admin/pemesanan");
    revalidatePath("/cek-pemesanan");

    return {
      success: true,
      referenceCode: result.referenceCode,
      bookingId: result.id,
    };
  } catch (error: any) {
    return {
      success: false,
      errorMsg: error.message || "Gagal memproses pemesanan. Silakan coba lagi.",
    };
  }
}

export async function getSnapTokenForBooking(referenceCode: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { referenceCode },
      include: { items: true, payments: true },
    });

    if (!booking) {
      return { success: false, errorMsg: "Pemesanan tidak ditemukan." };
    }

    if (booking.status === "PAID" || booking.status === "COMPLETED") {
      return { success: false, errorMsg: "Pemesanan ini sudah dibayar." };
    }

    // Call Midtrans API to get Snap Token
    const snapResult = await createSnapTransaction({
      orderId: booking.referenceCode,
      grossAmount: booking.totalPrice,
      customerDetails: {
        first_name: booking.customerName,
        phone: booking.whatsappNumber,
      },
      itemDetails: booking.items.map((i) => ({
        id: i.id,
        price: i.unitPrice,
        quantity: i.quantity,
        name: i.itemName,
      })),
    });

    // Save or update Payment record
    const existingPayment = booking.payments[0];
    if (existingPayment) {
      await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          providerOrderId: booking.referenceCode,
          status: "PENDING",
          rawPayload: { snapToken: snapResult.token, redirectUrl: snapResult.redirectUrl },
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          provider: "midtrans",
          providerOrderId: booking.referenceCode,
          status: "PENDING",
          rawPayload: { snapToken: snapResult.token, redirectUrl: snapResult.redirectUrl },
        },
      });
    }

    return { success: true, snapToken: snapResult.token };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal memuat gateway pembayaran." };
  }
}
