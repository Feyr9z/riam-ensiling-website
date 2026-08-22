import prisma from "@/lib/prisma";
import TiketManager from "./TiketManager";

export default async function AdminTiketPage() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { price: "asc" },
  });

  return <TiketManager initialItems={tickets} />;
}
