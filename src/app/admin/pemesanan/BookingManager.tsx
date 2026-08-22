"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge, { type BookingStatus } from "@/components/ui/StatusBadge/StatusBadge";
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

interface PaymentRecord {
  id: string;
  provider: string;
  providerOrderId: string | null;
  providerTransactionId: string | null;
  status: string;
  createdAt: Date;
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
  expiresAt: Date;
  items: BookingItem[];
  payments?: PaymentRecord[];
}

const STATUS_MAP: Record<string, BookingStatus> = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  COMPLETED: "completed",
};

// Allowed transitions mapping for Admin UI dropdown
const ALLOWED_TRANSITIONS: Record<string, { value: string; label: string }[]> = {
  PENDING: [
    { value: "PAID", label: "Set ke Paid" },
    { value: "CANCELLED", label: "Set ke Cancelled" },
    { value: "EXPIRED", label: "Set ke Expired" },
  ],
  PAID: [
    { value: "COMPLETED", label: "Set ke Completed" },
    { value: "CANCELLED", label: "Set ke Cancelled" },
  ],
  COMPLETED: [], // Final state
  CANCELLED: [
    { value: "PAID", label: "Aktifkan (Paid)" },
    { value: "PENDING", label: "Aktifkan (Pending)" },
  ],
  EXPIRED: [
    { value: "PAID", label: "Aktifkan (Paid)" },
    { value: "PENDING", label: "Aktifkan (Pending)" },
  ],
};

export default function BookingManager({ initialItems }: { initialItems: Booking[] }) {
  const [items, setItems] = useState<Booking[]>(initialItems);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Statistical Metrics
  const stats = useMemo(() => {
    const totalCount = items.length;
    const paidRevenue = items
      .filter((i) => i.status === "PAID" || i.status === "COMPLETED")
      .reduce((sum, i) => sum + i.totalPrice, 0);
    const pendingCount = items.filter((i) => i.status === "PENDING").length;
    const completedCount = items.filter((i) => i.status === "COMPLETED").length;

    return { totalCount, paidRevenue, pendingCount, completedCount };
  }, [items]);

  // Filtered & Searched Bookings List
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Status Filter
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = item.referenceCode.toLowerCase().includes(q);
        const matchName = item.customerName.toLowerCase().includes(q);
        const matchPhone = item.whatsappNumber.includes(q);
        return matchCode || matchName || matchPhone;
      }

      return true;
    });
  }, [items, statusFilter, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const bookingToUpdate = items.find((i) => i.id === id);
    if (!bookingToUpdate) return;

    const confirmMsg = `Apakah Anda yakin ingin mengubah status booking #${bookingToUpdate.referenceCode} dari "${bookingToUpdate.status}" menjadi "${newStatus}"?`;
    if (!confirm(confirmMsg)) return;

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
      {/* Header */}
      <div className={styles.header}>
        <h1>Daftar Pemesanan Wisatawan</h1>
      </div>

      {/* Overview Stats Summary Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#718096" }}>Total Transaksi</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a202c", marginTop: "0.25rem" }}>{stats.totalCount} Pemesanan</div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #c6f6d5", padding: "1.25rem", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#22543d" }}>Total Pendapatan Lunas</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#276749", marginTop: "0.25rem" }}>{formatRupiah(stats.paidRevenue)}</div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #feebc8", padding: "1.25rem", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#744210" }}>Menunggu Pembayaran</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#dd6b20", marginTop: "0.25rem" }}>{stats.pendingCount} Transaksi</div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1.25rem", borderRadius: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 700, color: "#4a5568" }}>Selesai Kunjungan</span>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2b6cb0", marginTop: "0.25rem" }}>{stats.completedCount} Pengunjung</div>
        </div>
      </div>

      {/* Filter & Search Controls Bar */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", padding: "1rem 1.25rem", borderRadius: "1rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { key: "ALL", label: "Semua" },
            { key: "PENDING", label: "Pending" },
            { key: "PAID", label: "Paid (Lunas)" },
            { key: "COMPLETED", label: "Completed" },
            { key: "CANCELLED", label: "Cancelled" },
            { key: "EXPIRED", label: "Expired" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "9999px",
                fontSize: "0.8125rem",
                fontWeight: statusFilter === tab.key ? 700 : 500,
                border: "none",
                cursor: "pointer",
                backgroundColor: statusFilter === tab.key ? "#1b4d3e" : "#edf2f7",
                color: statusFilter === tab.key ? "#ffffff" : "#4a5568",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ width: "100%", maxWidth: "300px" }}>
          <input
            type="text"
            className={styles.input}
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.875rem" }}
            placeholder="Cari Kode, Nama, WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
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
                <th>Status Saat Ini</th>
                <th>Aksi & Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    <p>Tidak ada transaksi pemesanan yang sesuai dengan filter.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const allowedNextOptions = ALLOWED_TRANSITIONS[item.status] || [];
                  const isCompletedFinal = item.status === "COMPLETED";

                  return (
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

                          {isCompletedFinal ? (
                            <span style={{ fontSize: "0.75rem", color: "#718096", fontWeight: 600, fontStyle: "italic", background: "#edf2f7", padding: "0.25rem 0.5rem", borderRadius: "0.375rem" }}>
                              🔒 Selesai (Final)
                            </span>
                          ) : (
                            <select
                              className={styles.select}
                              style={{ width: "auto", padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                              value=""
                              disabled={loading || allowedNextOptions.length === 0}
                              onChange={(e) => {
                                if (e.target.value) handleStatusChange(item.id, e.target.value);
                              }}
                            >
                              <option value="" disabled>
                                Ubah Status...
                              </option>
                              {allowedNextOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
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
                <strong>Status Saat Ini:</strong> <StatusBadge status={STATUS_MAP[selectedBooking.status] || "info"} />
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

            {/* Allowed Admin Actions inside Modal */}
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
              <strong style={{ fontSize: "0.8125rem", textTransform: "uppercase", color: "#718096", display: "block", marginBottom: "0.5rem" }}>Aksi Admin Terizin:</strong>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {selectedBooking.status === "PENDING" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange(selectedBooking.id, "PAID")}
                    >
                      ✓ Verifikasi Lunas (Paid)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(selectedBooking.id, "CANCELLED")}
                    >
                      ✕ Batalkan (Cancel)
                    </Button>
                  </>
                )}

                {selectedBooking.status === "PAID" && (
                  <>
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleStatusChange(selectedBooking.id, "COMPLETED")}
                    >
                      ✓ Selesai Berkunjung (Complete)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusChange(selectedBooking.id, "CANCELLED")}
                    >
                      ✕ Batalkan & Refund
                    </Button>
                  </>
                )}

                {(selectedBooking.status === "CANCELLED" || selectedBooking.status === "EXPIRED") && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleStatusChange(selectedBooking.id, "PAID")}
                  >
                    🔄 Aktifkan Kembali ke Paid
                  </Button>
                )}

                {selectedBooking.status === "COMPLETED" && (
                  <span style={{ fontSize: "0.8125rem", color: "#4a5568", fontStyle: "italic" }}>
                    Status transaksi ini sudah selesai (Completed) dan tidak dapat diubah kembali.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
