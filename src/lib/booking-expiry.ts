import prisma from "@/lib/prisma";

/**
 * Sweeps the database for any PENDING bookings that have passed their `expiresAt` timestamp,
 * and updates their status to `EXPIRED`. This automatically releases reserved gazebo slots
 * and ticket allocations.
 */
export async function expireStaleBookings(): Promise<{ expiredCount: number }> {
  try {
    const now = new Date();

    const result = await prisma.booking.updateMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lt: now,
        },
      },
      data: {
        status: "EXPIRED",
      },
    });

    if (result.count > 0) {
      console.log(`[Booking Expiry Auto-Sweep] Successfully updated ${result.count} stale pending booking(s) to EXPIRED.`);
    }

    return { expiredCount: result.count };
  } catch (error: any) {
    console.error("[Booking Expiry Error]:", error);
    return { expiredCount: 0 };
  }
}
