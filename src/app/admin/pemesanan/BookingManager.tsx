"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge, { BookingStatus } from "@/components/ui/StatusBadge/StatusBadge";
import { updateBookingStatus } from "./actions";
import styles from "@/components/admin/admin-table.module.scss";

interface BookingItem {
  id: string;
  itemType: string;
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
  visitDate: Date | string;
  status: string;
  totalPrice: number;
  createdAt: Date | string;
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
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    if (!confirm(`Ubah status pemesanan menjadi ${newStatus}?`)) return;
    setLoading(true);

    const res = await updateBookingStatus(bookingId, newStatus as any);
    if (res.success) {
      setItems(items.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)));
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    }
    setLoading(false);
  };

  const filteredItems = filterStatus === "ALL" ? items : items.filter((b) => b.status === filterStatus);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>Manajemen Pemesanan Tiket & Gazebo</h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Pantau status transaksi pemesanan dan verifikasi pengunjung
          </p>
        </div>

        <div>
          <select
            className={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">Menunggu Pembayaran</option>
            <option value="PAID">Sudah Dibayar</option>
            <option value="COMPLETED">Selesai / Terverifikasi</option>
            <option value="CANCELLED">Dibatalkan</option>
            <option value="EXPIRED">Kedaluwarsa</option>
          </select>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Nama Pemesan</th>
                <th>No. WhatsApp</th>
                <th>Tgl Kunjungan</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Belum ada data pemesanan.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ fontFamily: "monospace" }}>{item.referenceCode}</strong>
                    </td>
                    <td>{item.customerName}</td>
                    <td>{item.whatsappNumber}</td>
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
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
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

      {/* Modal / Detail View */}
      {selectedBooking && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem",
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className={styles.formCard}
            style={{ maxWidth: "500px", width: "100%", margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3>Detail Pemesanan #{selectedBooking.referenceCode}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                ✕
              </Button>
            </div>

            <div style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
              <p><strong>Nama:</strong> {selectedBooking.customerName}</p>
              <p><strong>WhatsApp:</strong> {selectedBooking.whatsappNumber}</p>
              <p><strong>Tgl Kunjungan:</strong> {formatDate(selectedBooking.visitDate)}</p>
              <p><strong>Status:</strong> <StatusBadge status={STATUS_MAP[selectedBooking.status] || "info"} /></p>
            </div>

            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Item Dipesan:</h4>
            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.875rem" }}>
              {selectedBooking.items.map((i) => (
                <li key={i.id}>
                  {i.itemName} ({i.quantity}x) — {formatRupiah(i.subtotal)}
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #eee" }}>
              <strong>Total Harga: {formatRupiah(selectedBooking.totalPrice)}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
