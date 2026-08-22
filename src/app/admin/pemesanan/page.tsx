import prisma from "@/lib/prisma";
import { expireStaleBookings } from "@/lib/booking-expiry";
import BookingManager from "./BookingManager";

export default async function AdminPemesananPage() {
  await expireStaleBookings();

  const bookings = await prisma.booking.findMany({
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <BookingManager initialItems={bookings} />;
}
