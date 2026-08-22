"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { BookingStatus } from "@prisma/client";

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi diperlukan");
  }
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  await checkAuth();

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  revalidatePath("/admin/pemesanan");
  revalidatePath("/cek-pemesanan");
  return { success: true };
}
