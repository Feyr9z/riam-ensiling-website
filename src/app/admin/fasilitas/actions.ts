"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const facilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  imageUrl: z.string().nullable().optional(),
  isPublished: z.boolean().default(true),
});

export type FacilityInput = z.infer<typeof facilitySchema>;

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi diperlukan");
  }
}

export async function createFacility(input: FacilityInput) {
  try {
    await checkAuth();

    const validation = facilitySchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const maxSort = await prisma.facility.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const nextSortOrder = (maxSort?.sortOrder ?? 0) + 1;

    const created = await prisma.facility.create({
      data: {
        name: validation.data.name,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || null,
        isPublished: validation.data.isPublished,
        sortOrder: nextSortOrder,
      },
    });

    revalidatePath("/admin/fasilitas");
    revalidatePath("/fasilitas");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal membuat fasilitas." };
  }
}

export async function updateFacility(id: string, input: FacilityInput) {
  try {
    await checkAuth();

    const validation = facilitySchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi semua bidang yang wajib." };
    }

    const existing = await prisma.facility.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, errorMsg: "Data fasilitas ini sudah tidak ada atau telah dihapus." };
    }

    const updated = await prisma.facility.update({
      where: { id },
      data: {
        name: validation.data.name,
        description: validation.data.description,
        imageUrl: validation.data.imageUrl || null,
        isPublished: validation.data.isPublished,
      },
    });

    revalidatePath("/admin/fasilitas");
    revalidatePath("/fasilitas");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal memperbarui fasilitas." };
  }
}

export async function deleteFacility(id: string) {
  try {
    await checkAuth();

    await prisma.facility.delete({ where: { id } });

    revalidatePath("/admin/fasilitas");
    revalidatePath("/fasilitas");
    return { success: true };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal menghapus fasilitas." };
  }
}
