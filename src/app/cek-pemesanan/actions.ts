"use server";

import prisma from "@/lib/prisma";
import { checkAndSyncMidtransStatus } from "@/lib/midtrans";

export async function searchBookingByCodeOrPhone(query: string) {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { success: false, errorMsg: "Mohon masukkan kode referensi booking atau nomor WhatsApp." };
    }

    let booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { referenceCode: { equals: cleanQuery } },
          { whatsappNumber: { equals: cleanQuery } },
        ],
      },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!booking) {
      return { success: false, errorMsg: `Data pemesanan untuk "${cleanQuery}" tidak ditemukan. Pastikan kode atau nomor WhatsApp sudah benar.` };
    }

    // Auto-sync status with Midtrans API if booking is PENDING
    if (booking.status === "PENDING") {
      await checkAndSyncMidtransStatus(booking.referenceCode);

      // Re-fetch updated booking from DB
      const updatedBooking = await prisma.booking.findUnique({
        where: { id: booking.id },
        include: {
          items: true,
          payments: true,
        },
      });
      if (updatedBooking) {
        booking = updatedBooking;
      }
    }

    return { success: true, booking };
  } catch (error: any) {
    return { success: false, errorMsg: "Gagal mencari data pemesanan." };
  }
}

export async function syncBookingStatusManually(referenceCode: string) {
  try {
    const res = await checkAndSyncMidtransStatus(referenceCode);
    if (!res.success) {
      return { success: false, errorMsg: res.errorMsg || "Gagal sinkronisasi status." };
    }

    const updatedBooking = await prisma.booking.findUnique({
      where: { referenceCode },
      include: {
        items: true,
        payments: true,
      },
    });

    return { success: true, booking: updatedBooking };
  } catch (error: any) {
    return { success: false, errorMsg: "Gagal menyinkronkan status dengan Midtrans." };
  }
}
