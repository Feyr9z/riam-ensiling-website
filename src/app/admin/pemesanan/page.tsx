import prisma from "@/lib/prisma";
import BookingManager from "./BookingManager";

export default async function AdminPemesananPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <BookingManager initialItems={bookings} />;
}
