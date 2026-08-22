"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const gallerySchema = z.object({
  imageUrl: z.string().min(1, "URL gambar wajib diisi"),
});

export type GalleryInput = z.infer<typeof gallerySchema>;

async function checkAuth() {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    throw new Error("Otorisasi diperlukan");
  }
}

export async function createGalleryItem(input: GalleryInput) {
  try {
    await checkAuth();

    const validation = gallerySchema.safeParse(input);
    if (!validation.success) {
      return { success: false, errorMsg: "Mohon isi URL gambar." };
    }

    const maxSort = await prisma.galleryItem.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });
    const nextSortOrder = (maxSort?.sortOrder ?? 0) + 1;

    const created = await prisma.galleryItem.create({
      data: {
        imageUrl: validation.data.imageUrl,
        sortOrder: nextSortOrder,
      },
    });

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true, data: created };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal menambah foto." };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await checkAuth();

    await prisma.galleryItem.delete({ where: { id } });

    revalidatePath("/admin/galeri");
    revalidatePath("/galeri");
    return { success: true };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal menghapus foto." };
  }
}
