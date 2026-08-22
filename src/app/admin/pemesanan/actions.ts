"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { BookingStatus } from "@prisma/client";

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi admin diperlukan.");
  }
}

// Business Rules matrix for status transitions
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: ["PAID", "CANCELLED", "EXPIRED"],
  PAID: ["COMPLETED", "CANCELLED"],
  COMPLETED: [], // Final state
  CANCELLED: ["PAID", "PENDING"], // Requires gazebo double-booking check
  EXPIRED: ["PAID", "PENDING"], // Requires gazebo double-booking check
};

export async function updateBookingStatus(bookingId: string, newStatus: BookingStatus) {
  try {
    await checkAuth();

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { items: true },
    });

    if (!existingBooking) {
      return { success: false, errorMsg: "Data pemesanan tidak ditemukan." };
    }

    const currentStatus = existingBooking.status;

    // 1. Rule Check: Disallow same status transition
    if (currentStatus === newStatus) {
      return { success: false, errorMsg: `Pemesanan sudah berstatus ${newStatus}.` };
    }

    // 2. Rule Check: Validate allowed transition matrix
    const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowedNextStatuses.includes(newStatus)) {
      if (currentStatus === "COMPLETED") {
        return {
          success: false,
          errorMsg: "Pemesanan yang sudah SELESAI (Completed) tidak dapat diubah statusnya lagi.",
        };
      }
      return {
        success: false,
        errorMsg: `Perubahan status dari ${currentStatus} ke ${newStatus} tidak diperbolehkan.`,
      };
    }

    // 3. Double-booking check if reactivating a CANCELLED or EXPIRED booking with gazebo
    if (
      (currentStatus === "CANCELLED" || currentStatus === "EXPIRED") &&
      (newStatus === "PAID" || newStatus === "PENDING")
    ) {
      const gazeboItem = existingBooking.items.find(
        (i) => i.itemType === "GAZEBO" && i.gazeboId !== null
      );

      if (gazeboItem && gazeboItem.gazeboId) {
        const startOfDay = new Date(new Date(existingBooking.visitDate).setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date(existingBooking.visitDate).setHours(23, 59, 59, 999));

        const conflictingBooking = await prisma.bookingItem.findFirst({
          where: {
            itemType: "GAZEBO",
            gazeboId: gazeboItem.gazeboId,
            bookingId: { not: existingBooking.id },
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

        if (conflictingBooking) {
          return {
            success: false,
            errorMsg: `Tidak dapat mengaktifkan booking ini. Gazebo (${gazeboItem.itemName}) sudah dipesan oleh booking #${conflictingBooking.booking.referenceCode} untuk tanggal kunjungan tersebut.`,
          };
        }
      }
    }

    // 4. Perform update in Prisma transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { status: newStatus },
      });

      // Update associated payment record status if exists
      const paymentStatusMap: Record<string, string> = {
        PAID: "PAID",
        PENDING: "PENDING",
        CANCELLED: "FAILED",
        EXPIRED: "EXPIRED",
        COMPLETED: "PAID",
      };

      await tx.payment.updateMany({
        where: { bookingId },
        data: { status: paymentStatusMap[newStatus] || "PENDING" },
      });

      return updatedBooking;
    });

    revalidatePath("/admin/pemesanan");
    revalidatePath("/cek-pemesanan");

    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal mengubah status pemesanan." };
  }
}
