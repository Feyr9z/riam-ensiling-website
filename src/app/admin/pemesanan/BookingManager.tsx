"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge, { type BookingStatus } from "@/components/ui/StatusBadge/StatusBadge";
import { updateBookingStatus } from "./actions";
import styles from "@/components/admin/admin-table.module.scss";

interface BookingItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Booking {
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

const STATUS_MAP: Record<string, BookingStatus> = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  COMPLETED: "completed",
};

export default function BookingManager({ initialItems }: { initialItems: Booking[] }) {
  const [items, setItems] = useState<Booking[]>(initialItems);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoading(true);
    const res = await updateBookingStatus(id, newStatus as any);
    if (res.success && res.data) {
      setItems(items.map((i) => (i.id === id ? { ...i, status: res.data!.status } : i)));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: res.data!.status });
      }
    } else {
      alert(res.errorMsg || "Gagal mengubah status pemesanan.");
    }
    setLoading(false);
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className={styles.header}>
        <h1>Daftar Pemesanan Wisatawan</h1>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Booking</th>
                <th>Pemesan</th>
                <th>Tgl Kunjungan</th>
                <th>Total Harga</th>
                <th>Status</th>
                <th>Aksi & Ubah Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Belum ada transaksi pemesanan.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong style={{ fontFamily: "monospace", color: "#2b6cb0" }}>{item.referenceCode}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{item.customerName}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>{item.whatsappNumber}</div>
                      </div>
                    </td>
                    <td>{formatDate(item.visitDate)}</td>
                    <td>
                      <strong>{formatRupiah(item.totalPrice)}</strong>
                    </td>
                    <td>
                      <StatusBadge status={STATUS_MAP[item.status] || "info"} />
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedBooking(item)}
                        >
                          Rincian
                        </Button>

                        <select
                          className={styles.select}
                          style={{ width: "auto", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                          value={item.status}
                          disabled={loading}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PAID">Paid</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="EXPIRED">Expired</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedBooking && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedBooking(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>Detail Pemesanan #{selectedBooking.referenceCode}</h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setSelectedBooking(null)}
                aria-label="Tutup modal detail"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ fontSize: "0.875rem", lineHeight: "1.7", color: "#2d3748" }}>
              <p><strong>Nama Pemesan:</strong> {selectedBooking.customerName}</p>
              <p><strong>Nomor WhatsApp:</strong> {selectedBooking.whatsappNumber}</p>
              <p><strong>Tanggal Kunjungan:</strong> {formatDate(selectedBooking.visitDate)}</p>
              <p style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                <strong>Status:</strong> <StatusBadge status={STATUS_MAP[selectedBooking.status] || "info"} />
              </p>
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "0.875rem", color: "#1a202c", display: "block", marginBottom: "0.5rem" }}>Rincian Item Tiket & Gazebo:</strong>
              <ul style={{ listStyle: "disc", paddingLeft: "1.2rem", fontSize: "0.875rem", color: "#4a5568" }}>
                {selectedBooking.items.map((i) => (
                  <li key={i.id} style={{ marginBottom: "0.25rem" }}>
                    <strong>{i.itemName}</strong> ({i.quantity}x) — {formatRupiah(i.subtotal)}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "2px dashed #cbd5e0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1rem", fontWeight: 700, color: "#1b4d3e" }}>
              <span>Total Pembayaran:</span>
              <span>{formatRupiah(selectedBooking.totalPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
