"use server";

import prisma from "@/lib/prisma";

export async function searchBookingByCodeOrPhone(query: string) {
  try {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { success: false, errorMsg: "Mohon masukkan kode referensi booking atau nomor WhatsApp." };
    }

    const booking = await prisma.booking.findFirst({
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

    return { success: true, booking };
  } catch (error: any) {
    return { success: false, errorMsg: "Gagal mencari data pemesanan." };
  }
}
