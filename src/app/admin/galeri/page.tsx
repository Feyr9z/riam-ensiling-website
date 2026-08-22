import prisma from "@/lib/prisma";
import GaleriManager from "./GaleriManager";

export default async function AdminGaleriPage() {
  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <GaleriManager initialItems={galleryItems} />;
}
