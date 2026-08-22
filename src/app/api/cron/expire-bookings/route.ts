import { NextResponse } from "next/server";
import { expireStaleBookings } from "@/lib/booking-expiry";

export async function GET() {
  const result = await expireStaleBookings();
  return NextResponse.json({
    success: true,
    message: `Proses pemeriksaan booking kedaluwarsa selesai.`,
    expiredCount: result.expiredCount,
    timestamp: new Date().toISOString(),
  });
}

export async function POST() {
  const result = await expireStaleBookings();
  return NextResponse.json({
    success: true,
    message: `Proses pemeriksaan booking kedaluwarsa selesai.`,
    expiredCount: result.expiredCount,
    timestamp: new Date().toISOString(),
  });
}
