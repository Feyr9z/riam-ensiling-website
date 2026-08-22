import prisma from "@/lib/prisma";
import FasilitasManager from "./FasilitasManager";

export default async function AdminFasilitasPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return <FasilitasManager initialItems={facilities} />;
}
