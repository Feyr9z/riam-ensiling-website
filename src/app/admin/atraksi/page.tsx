import prisma from "@/lib/prisma";
import AtraksiManager from "./AtraksiManager";

export default async function AdminAtraksiPage() {
  const attractions = await prisma.attraction.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <AtraksiManager initialItems={attractions} />;
}
