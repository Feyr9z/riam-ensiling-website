"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const gazeboSchema = z.object({
  code: z.string().min(1, "Kode gazebo wajib diisi"),
  name: z.string().min(1, "Nama gazebo wajib diisi"),
  price: z.number().int().min(0, "Harga sewa tidak boleh negatif"),
  capacity: z.number().int().nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export type GazeboInput = z.infer<typeof gazeboSchema>;

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi diperlukan");
  }
}

export async function createGazebo(input: GazeboInput) {
  try {
    await checkAuth();

    const validation = gazeboSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const codeClean = validation.data.code.trim().toUpperCase();

    // Check unique code
    const existing = await prisma.gazebo.findUnique({ where: { code: codeClean } });
    if (existing) {
      return { success: false, errorMsg: `Kode "${codeClean}" sudah digunakan oleh (${existing.name}). Gunakan kode lain.` };
    }

    const created = await prisma.gazebo.create({
      data: {
        code: codeClean,
        name: validation.data.name,
        price: validation.data.price,
        capacity: validation.data.capacity || null,
        description: validation.data.description || null,
        isActive: validation.data.isActive,
      },
    });

    revalidatePath("/admin/gazebo");
    revalidatePath("/tiket-gazebo");
    revalidatePath("/pemesanan");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal membuat gazebo." };
  }
}

export async function updateGazebo(id: string, input: GazeboInput) {
  try {
    await checkAuth();

    const validation = gazeboSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const codeClean = validation.data.code.trim().toUpperCase();

    const existing = await prisma.gazebo.findFirst({
      where: {
        code: codeClean,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, errorMsg: `Kode "${codeClean}" sudah digunakan oleh gazebo lain.` };
    }

    const updated = await prisma.gazebo.update({
      where: { id },
      data: {
        code: codeClean,
        name: validation.data.name,
        price: validation.data.price,
        capacity: validation.data.capacity || null,
        description: validation.data.description || null,
        isActive: validation.data.isActive,
      },
    });

    revalidatePath("/admin/gazebo");
    revalidatePath("/tiket-gazebo");
    revalidatePath("/pemesanan");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal memperbarui gazebo." };
  }
}

export async function deleteGazebo(id: string) {
  try {
    await checkAuth();

    await prisma.gazebo.delete({ where: { id } });

    revalidatePath("/admin/gazebo");
    revalidatePath("/tiket-gazebo");
    revalidatePath("/pemesanan");
    return { success: true };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal menghapus gazebo." };
  }
}
