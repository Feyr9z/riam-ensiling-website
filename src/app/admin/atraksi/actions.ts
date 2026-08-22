"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const attractionSchema = z.object({
  name: z.string().min(1, "Nama atraksi wisata wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  imageUrl: z.string().nullable().optional(),
  isPublished: z.boolean().default(true),
});

export type AttractionInput = z.infer<typeof attractionSchema>;

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi diperlukan");
  }
}

export async function createAttraction(input: AttractionInput) {
  try {
    await checkAuth();

    const validation = attractionSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    // Auto-calculate highest sortOrder + 1
    const maxSort = await prisma.attraction.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const nextSortOrder = (maxSort?.sortOrder ?? 0) + 1;

    const created = await prisma.attraction.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || null,
        isPublished: validation.data.isPublished,
        sortOrder: nextSortOrder,
      },
    });

    revalidatePath("/admin/atraksi");
    revalidatePath("/atraksi");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal membuat atraksi wisata." };
  }
}

export async function updateAttraction(id: string, input: AttractionInput) {
  try {
    await checkAuth();

    const validation = attractionSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const existing = await prisma.attraction.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, errorMsg: "Data atraksi wisata ini sudah tidak ada atau telah dihapus." };
    }

    const updated = await prisma.attraction.update({
      where: { id },
      data: {
        name: validation.data.name,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || null,
        isPublished: validation.data.isPublished,
      },
    });

    revalidatePath("/admin/atraksi");
    revalidatePath("/atraksi");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal memperbarui atraksi wisata." };
  }
}

export async function deleteAttraction(id: string) {
  try {
    await checkAuth();

    await prisma.attraction.delete({
      where: { id },
    });

    revalidatePath("/admin/atraksi");
    revalidatePath("/atraksi");
    return { success: true };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal menghapus atraksi wisata." };
  }
}
