"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const ticketSchema = z.object({
  name: z.string().min(1, "Nama tiket wajib diisi"),
  price: z.number().int().min(0, "Harga tidak boleh negatif"),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type TicketInput = z.infer<typeof ticketSchema>;

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi diperlukan");
  }
}

export async function createTicket(input: TicketInput) {
  try {
    await checkAuth();

    const validation = ticketSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const created = await prisma.ticket.create({
      data: {
        name: validation.data.name,
        price: validation.data.price,
        description: validation.data.description || null,
        isActive: validation.data.isActive,
      },
    });

    revalidatePath("/admin/tiket");
    revalidatePath("/tiket-gazebo");
    revalidatePath("/pemesanan");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal membuat tiket." };
  }
}

export async function updateTicket(id: string, input: TicketInput) {
  try {
    await checkAuth();

    const validation = ticketSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const existing = await prisma.ticket.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, errorMsg: "Data tiket ini sudah tidak ada atau telah dihapus." };
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        name: validation.data.name,
        price: validation.data.price,
        description: validation.data.description || null,
        isActive: validation.data.isActive,
      },
    });

    revalidatePath("/admin/tiket");
    revalidatePath("/tiket-gazebo");
    revalidatePath("/pemesanan");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal memperbarui tiket." };
  }
}

export async function deleteTicket(id: string) {
  try {
    await checkAuth();

    await prisma.ticket.delete({ where: { id } });

    revalidatePath("/admin/tiket");
    revalidatePath("/tiket-gazebo");
    revalidatePath("/pemesanan");
    return { success: true };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal menghapus tiket." };
  }
}
