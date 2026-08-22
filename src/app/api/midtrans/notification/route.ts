import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyMidtransNotificationSignature } from "@/lib/midtrans";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      transaction_id: transactionId,
    } = body;

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return NextResponse.json(
        { status: "ERROR", message: "Payload tidak lengkap" },
        { status: 400 }
      );
    }

    // 1. Signature Verification
    const isValidSignature = verifyMidtransNotificationSignature(
      orderId,
      statusCode,
      grossAmount,
      signatureKey
    );

    if (!isValidSignature) {
      console.warn(`[Midtrans Webhook] Tanda tangan (signature) tidak valid untuk order_id: ${orderId}`);
      return NextResponse.json(
        { status: "FORBIDDEN", message: "Tanda tangan signature tidak sah" },
        { status: 403 }
      );
    }

    // 2. Find booking by reference code (order_id)
    const booking = await prisma.booking.findUnique({
      where: { referenceCode: orderId },
      include: { payments: true },
    });

    if (!booking) {
      return NextResponse.json(
        { status: "NOT_FOUND", message: "Data pemesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // 3. Idempotency Check: Ignore if already marked PAID or COMPLETED
    if (booking.status === "PAID" || booking.status === "COMPLETED") {
      return NextResponse.json({
        status: "OK",
        message: "Status pemesanan sudah diproses (Lunas/Selesai)",
      });
    }

    // 4. Map Midtrans transaction status to Booking & Payment status
    let newBookingStatus: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "COMPLETED" = booking.status;
    let newPaymentStatus: "PENDING" | "PAID" | "FAILED" | "EXPIRED" = "PENDING";

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        newBookingStatus = "PAID";
        newPaymentStatus = "PAID";
      }
    } else if (transactionStatus === "settlement") {
      newBookingStatus = "PAID";
      newPaymentStatus = "PAID";
    } else if (transactionStatus === "pending") {
      newBookingStatus = "PENDING";
      newPaymentStatus = "PENDING";
    } else if (transactionStatus === "deny" || transactionStatus === "cancel") {
      newBookingStatus = "CANCELLED";
      newPaymentStatus = "FAILED";
    } else if (transactionStatus === "expire") {
      newBookingStatus = "EXPIRED";
      newPaymentStatus = "EXPIRED";
    }

    // 5. Update Booking & Payment in DB transaction
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: newBookingStatus },
      });

      // Update or create payment record
      const existingPayment = booking.payments[0];
      if (existingPayment) {
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: newPaymentStatus,
            providerOrderId: orderId,
            providerTransactionId: transactionId || null,
            rawPayload: body,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            provider: "midtrans",
            providerOrderId: orderId,
            providerTransactionId: transactionId || null,
            status: newPaymentStatus,
            rawPayload: body,
          },
        });
      }
    });

    console.log(`[Midtrans Webhook Success] Booking ${orderId} updated to ${newBookingStatus}`);

    return NextResponse.json({
      status: "OK",
      message: `Berhasil memperbarui status pemesanan ke ${newBookingStatus}`,
    });
  } catch (error: any) {
    console.error("[Midtrans Webhook Error]:", error);
    return NextResponse.json(
      { status: "ERROR", message: error.message || "Gagal memproses notifikasi webhook" },
      { status: 500 }
    );
  }
}
