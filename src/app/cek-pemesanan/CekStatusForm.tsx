"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import { NEXT_PUBLIC_MIDTRANS_CLIENT_KEY } from "@/lib/midtrans";
import { getSnapTokenForBooking } from "@/app/pemesanan/actions";
import { searchBookingByCodeOrPhone } from "./actions";
import styles from "./CekStatusForm.module.scss";

declare global {
  interface Window {
    snap?: any;
  }
}

interface BookingItem {
  id: string;
  itemType: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface BookingResult {
  id: string;
  referenceCode: string;
  customerName: string;
  whatsappNumber: string;
  visitDate: Date;
  status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "COMPLETED";
  totalPrice: number;
  createdAt: Date;
  items: BookingItem[];
}

export default function CekStatusForm() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [query, setQuery] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResult | null>(null);

  // Dynamically load Midtrans Snap JS SDK
  useEffect(() => {
    const snapUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const existingScript = document.getElementById("midtrans-snap-script");

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = snapUrl;
      script.id = "midtrans-snap-script";
      script.setAttribute("data-client-key", NEXT_PUBLIC_MIDTRANS_CLIENT_KEY);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSearch = useCallback(async (searchKey: string) => {
    if (!searchKey.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setBooking(null);

    const res = await searchBookingByCodeOrPhone(searchKey);
    if (res.success && res.booking) {
      setBooking(res.booking as unknown as BookingResult);
    } else {
      setErrorMsg(res.errorMsg || "Pemesanan tidak ditemukan.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode, handleSearch]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handlePayWithSnap = async (refCode: string) => {
    setPayLoading(true);
    const tokenRes = await getSnapTokenForBooking(refCode);

    if (tokenRes.success && tokenRes.snapToken) {
      if (window.snap) {
        window.snap.pay(tokenRes.snapToken, {
          onSuccess: function () {
            handleSearch(refCode);
          },
          onPending: function () {
            handleSearch(refCode);
          },
          onError: function () {
            alert("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function () {
            handleSearch(refCode);
          },
        });
      }
    } else {
      alert(tokenRes.errorMsg || "Gagal memuat gateway pembayaran.");
    }
    setPayLoading(false);
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return (
    <div className={styles.container}>
      {/* Search Form Card */}
      <div className={styles.searchCard}>
        <form onSubmit={onSubmit} className={styles.searchForm}>
          <div className={styles.field}>
            <label className={styles.label}>Kode Booking atau Nomor WhatsApp *</label>
            <input
              required
              className={styles.input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="misal: RE-20260822-DEMO atau 081234567890"
            />
          </div>
          <Button type="submit" variant="primary" size="md" loading={loading}>
            Cari Status Booking
          </Button>
        </form>

        {errorMsg && (
          <div style={{ color: "#e53e3e", backgroundColor: "#fff5f5", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #feb2b2", marginTop: "1.5rem", fontWeight: 600 }}>
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* Result Card */}
      {booking && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <div>
              <div className={styles.refCode}>{booking.referenceCode}</div>
              <div className={styles.customerInfo}>
                Pemesan: <strong>{booking.customerName}</strong> ({booking.whatsappNumber})
              </div>
              <div className={styles.customerInfo}>
                Tanggal Kunjungan: <strong>{new Date(booking.visitDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
              </div>
            </div>
            <div>
              <StatusBadge
                status={
                  booking.status === "PAID"
                    ? "paid"
                    : booking.status === "PENDING"
                    ? "pending"
                    : booking.status === "COMPLETED"
                    ? "completed"
                    : booking.status === "CANCELLED"
                    ? "cancelled"
                    : "expired"
                }
                label={
                  booking.status === "PAID"
                    ? "Sudah Dibayar (Lunas)"
                    : booking.status === "PENDING"
                    ? "Menunggu Pembayaran"
                    : booking.status === "COMPLETED"
                    ? "Selesai Berkunjung"
                    : booking.status === "CANCELLED"
                    ? "Dibatalkan"
                    : "Kedaluwarsa"
                }
              />
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>Rincian Tiket & Gazebo Yang Dipesan:</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.itemTable}>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Jumlah</th>
                    <th>Harga Satuan</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.itemName}</strong>
                      </td>
                      <td>{item.quantity}x</td>
                      <td>{formatRupiah(item.unitPrice)}</td>
                      <td>{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.grandTotal}>
              <span>Total Pembayaran:</span>
              <span>{formatRupiah(booking.totalPrice)}</span>
            </div>
          </div>

          {booking.status === "PENDING" && (
            <div style={{ background: "#fffaf0", border: "1px solid #feebc8", padding: "1.5rem", borderRadius: "1rem", marginTop: "1.5rem" }}>
              <h4 style={{ color: "#dd6b20", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>⚠️ Menunggu Pembayaran Digital</h4>
              <p style={{ fontSize: "0.875rem", color: "#744210", lineHeight: 1.5, marginBottom: "1rem" }}>
                Pemesanan Anda sedang menunggu proses verifikasi atau transaksi via Midtrans Snap (QRIS, ShopeePay, GoPay, Virtual Account).
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Button
                  variant="accent"
                  size="md"
                  loading={payLoading}
                  onClick={() => handlePayWithSnap(booking.referenceCode)}
                >
                  💳 Selesaikan Pembayaran via Midtrans
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  loading={loading}
                  onClick={() => handleSearch(booking.referenceCode)}
                >
                  🔄 Cek / Refresh Status Pembayaran
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
