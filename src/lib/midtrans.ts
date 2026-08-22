import crypto from "crypto";
import prisma from "@/lib/prisma";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-demo-key";
export const NEXT_PUBLIC_MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-demo-key";
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const SNAP_API_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const MIDTRANS_STATUS_API_URL = IS_PRODUCTION
  ? "https://api.midtrans.com/v2"
  : "https://api.sandbox.midtrans.com/v2";

export interface MidtransItemDetail {
  id: string;
  price: number;
  quantity: number;
  name: string;
}

export interface MidtransCustomerDetails {
  first_name: string;
  phone: string;
}

export interface CreateSnapTransactionInput {
  orderId: string; // referenceCode
  grossAmount: number; // totalPrice in IDR
  customerDetails: MidtransCustomerDetails;
  itemDetails: MidtransItemDetail[];
}

export async function createSnapTransaction(input: CreateSnapTransactionInput) {
  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const payload = {
    transaction_details: {
      order_id: input.orderId,
      gross_amount: Math.round(input.grossAmount),
    },
    customer_details: {
      first_name: input.customerDetails.first_name,
      phone: input.customerDetails.phone,
    },
    item_details: input.itemDetails.map((item) => ({
      id: item.id.substring(0, 50),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    })),
  };

  const response = await fetch(SNAP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Midtrans API Error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return {
    token: data.token as string,
    redirectUrl: data.redirect_url as string,
  };
}

export function verifyMidtransNotificationSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  // Signature formula: SHA512(order_id + status_code + gross_amount + ServerKey)
  const rawString = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`;
  const computedSignature = crypto.createHash("sha512").update(rawString).digest("hex");
  return computedSignature === signatureKey;
}

/**
 * Directly queries Midtrans Status API for an order_id (referenceCode)
 * and updates DB status accordingly. Used for local dev testing (no ngrok needed)
 * and active status polling/sync.
 */
export async function checkAndSyncMidtransStatus(orderId: string) {
  try {
    const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
    const response = await fetch(`${MIDTRANS_STATUS_API_URL}/${orderId}/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, errorMsg: `Gagal mengecek status Midtrans (${response.status})` };
    }

    const data = await response.json();
    const {
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      transaction_id: transactionId,
      gross_amount: grossAmount,
    } = data;

    const booking = await prisma.booking.findUnique({
      where: { referenceCode: orderId },
      include: { payments: true },
    });

    if (!booking) {
      return { success: false, errorMsg: "Booking tidak ditemukan." };
    }

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

    // Update status in DB
    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: newBookingStatus },
      });

      const existingPayment = booking.payments[0];
      if (existingPayment) {
        await tx.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: newPaymentStatus,
            providerOrderId: orderId,
            providerTransactionId: transactionId || null,
            rawPayload: data,
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
            rawPayload: data,
          },
        });
      }
    });

    return {
      success: true,
      bookingStatus: newBookingStatus,
      paymentStatus: newPaymentStatus,
      rawStatus: transactionStatus,
    };
  } catch (error: any) {
    return { success: false, errorMsg: error.message || "Gagal sinkronisasi status." };
  }
}
