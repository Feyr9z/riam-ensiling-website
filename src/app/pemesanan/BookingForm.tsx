"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import { getAvailableGazebosForDate, createBooking } from "./actions";
import styles from "./BookingForm.module.scss";

interface TicketItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
}

interface GazeboOption {
  id: string;
  code: string;
  name: string;
  price: number;
  capacity: number | null;
  description: string | null;
  isAvailable: boolean;
}

export default function BookingForm({ availableTickets }: { availableTickets: TicketItem[] }) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [visitDate, setVisitDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });

  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    availableTickets.forEach((t) => {
      initial[t.id] = 0;
    });
    // Default 1 adult ticket
    if (availableTickets.length > 0) {
      initial[availableTickets[0].id] = 1;
    }
    return initial;
  });

  const [gazebos, setGazebos] = useState<GazeboOption[]>([]);
  const [selectedGazeboId, setSelectedGazeboId] = useState<string | null>(null);
  const [loadingGazebos, setLoadingGazebos] = useState(false);

  // Booking Result State
  const [createdBooking, setCreatedBooking] = useState<{ referenceCode: string; bookingId: string } | null>(null);

  // Fetch gazebos when visitDate changes
  const fetchGazebos = useCallback(async (dateStr: string) => {
    setLoadingGazebos(true);
    const res = await getAvailableGazebosForDate(dateStr);
    if (res.success && res.gazebos) {
      setGazebos(res.gazebos);
    }
    setLoadingGazebos(false);
  }, []);

  useEffect(() => {
    if (visitDate) {
      fetchGazebos(visitDate);
    }
  }, [visitDate, fetchGazebos]);

  const handleQuantityChange = (id: string, delta: number) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const calculateSubtotalTickets = () => {
    return availableTickets.reduce((sum, t) => sum + t.price * (ticketQuantities[t.id] || 0), 0);
  };

  const getSelectedGazebo = () => gazebos.find((g) => g.id === selectedGazeboId);

  const calculateGrandTotal = () => {
    const ticketTotal = calculateSubtotalTickets();
    const gzb = getSelectedGazebo();
    const gazeboTotal = gzb ? gzb.price : 0;
    return ticketTotal + gazeboTotal;
  };

  const handleStep1Next = () => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg("Mohon isi nama lengkap Anda (minimal 2 karakter).");
      return;
    }
    if (!whatsappNumber.trim() || whatsappNumber.trim().length < 9) {
      setErrorMsg("Mohon isi nomor WhatsApp aktif Anda.");
      return;
    }
    if (!visitDate) {
      setErrorMsg("Mohon pilih tanggal kunjungan Anda.");
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleStep2Next = () => {
    const totalQty = Object.values(ticketQuantities).reduce((a, b) => a + b, 0);
    if (totalQty === 0) {
      setErrorMsg("Mohon pilih minimal 1 tiket masuk.");
      return;
    }
    setErrorMsg(null);
    setStep(3);
  };

  const handleStep3Next = () => {
    setErrorMsg(null);
    setStep(4);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMsg(null);

    const ticketPayload = Object.entries(ticketQuantities).map(([ticketId, quantity]) => ({
      ticketId,
      quantity,
    }));

    const res = await createBooking({
      customerName: customerName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      visitDate,
      tickets: ticketPayload,
      selectedGazeboId,
    });

    if (res.success && res.referenceCode && res.bookingId) {
      setCreatedBooking({
        referenceCode: res.referenceCode,
        bookingId: res.bookingId,
      });
    } else {
      setErrorMsg(res.errorMsg || "Gagal memproses pemesanan.");
    }
    setLoading(false);
  };

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  // Success Confirmation View
  if (createdBooking) {
    return (
      <div className={styles.bookingContainer}>
        <div className={styles.formCard} style={{ textAlign: "center", padding: "3rem 2rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e6fffa", color: "#319795", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Pemesanan Berhasil Dibuat!</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Kode referensi booking Anda adalah:
          </p>

          <div style={{ background: "#edf2f7", padding: "1rem", borderRadius: "0.75rem", display: "inline-block", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "1px", color: "#2b6cb0", marginBottom: "2rem" }}>
            {createdBooking.referenceCode}
          </div>

          <div className={styles.summaryBox} style={{ textAlign: "left", marginBottom: "2rem" }}>
            <div className={styles.summaryRow}>
              <span>Nama Pemesan:</span>
              <strong>{customerName}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Nomor WhatsApp:</span>
              <strong>{whatsappNumber}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Tanggal Kunjungan:</span>
              <strong>{new Date(visitDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total Pembayaran:</span>
              <span>{formatRupiah(calculateGrandTotal())}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button as="link" href={`/cek-pemesanan?code=${createdBooking.referenceCode}`} variant="accent" size="lg">
              Cek Status & Instruksi Pembayaran
            </Button>
            <Button as="link" href="/" variant="ghost" size="lg">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingContainer}>
      {/* Progress Step Indicator */}
      <div className={styles.stepIndicator}>
        <div className={`${styles.stepItem} ${step === 1 ? styles["stepItem--active"] : ""} ${step > 1 ? styles["stepItem--completed"] : ""}`}>
          <div className={styles.stepCircle}>{step > 1 ? "✓" : "1"}</div>
          <span className={styles.stepLabel}>Data Diri</span>
        </div>

        <div className={`${styles.stepItem} ${step === 2 ? styles["stepItem--active"] : ""} ${step > 2 ? styles["stepItem--completed"] : ""}`}>
          <div className={styles.stepCircle}>{step > 2 ? "✓" : "2"}</div>
          <span className={styles.stepLabel}>Pilih Tiket</span>
        </div>

        <div className={`${styles.stepItem} ${step === 3 ? styles["stepItem--active"] : ""} ${step > 3 ? styles["stepItem--completed"] : ""}`}>
          <div className={styles.stepCircle}>{step > 3 ? "✓" : "3"}</div>
          <span className={styles.stepLabel}>Pilih Gazebo</span>
        </div>

        <div className={`${styles.stepItem} ${step === 4 ? styles["stepItem--active"] : ""}`}>
          <div className={styles.stepCircle}>4</div>
          <span className={styles.stepLabel}>Konfirmasi</span>
        </div>
      </div>

      {errorMsg && (
        <div style={{ color: "#e53e3e", backgroundColor: "#fff5f5", padding: "1rem", borderRadius: "0.75rem", border: "1px solid #feb2b2", marginBottom: "1.5rem", fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Step 1: Data Diri & Tanggal */}
      {step === 1 && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Langkah 1: Tanggal Kunjungan & Data Diri</h2>
          <p className={styles.formSubtitle}>Masukkan nama lengkap dan nomor WhatsApp aktif Anda untuk konfirmasi e-tiket.</p>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nama Lengkap Pemesan *</label>
              <input
                required
                className={styles.input}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="misal: Budi Santoso"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nomor WhatsApp (Aktif) *</label>
              <input
                required
                type="tel"
                className={styles.input}
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="misal: 081234567890"
              />
            </div>

            <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>Tanggal Kunjungan *</label>
              <input
                required
                type="date"
                className={styles.input}
                min={new Date().toISOString().slice(0, 10)}
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formActions} style={{ justifyContent: "flex-end" }}>
            <Button variant="primary" size="md" onClick={handleStep1Next}>
              Lanjut ke Pilih Tiket &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Pilih Tiket */}
      {step === 2 && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Langkah 2: Pilih Tiket Masuk</h2>
          <p className={styles.formSubtitle}>Tentukan jumlah tiket masuk sesuai kategori pengunjung (minimal 1 tiket).</p>

          {availableTickets.map((t) => (
            <div key={t.id} className={styles.ticketSelectorItem}>
              <div className={styles.itemInfo}>
                <strong>{t.name}</strong>
                <span>{t.description || "Akses ke seluruh kawasan objek wisata"}</span>
                <div className={styles.priceTag}>{formatRupiah(t.price)} / orang</div>
              </div>

              <div className={styles.quantityControl}>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(t.id, -1)}
                  disabled={ticketQuantities[t.id] === 0}
                >
                  -
                </button>
                <span>{ticketQuantities[t.id] || 0}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(t.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className={styles.summaryBox} style={{ marginTop: "1.5rem" }}>
            <div className={styles.summaryRow}>
              <span>Subtotal Tiket:</span>
              <strong>{formatRupiah(calculateSubtotalTickets())}</strong>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button variant="ghost" size="md" onClick={() => setStep(1)}>
              &larr; Kembali
            </Button>
            <Button variant="primary" size="md" onClick={handleStep2Next}>
              Lanjut ke Pilih Gazebo &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Pilih Gazebo */}
      {step === 3 && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Langkah 3: Pilih Sewa Gazebo (Opsional)</h2>
          <p className={styles.formSubtitle}>
            Pilih gazebo sejuk tepi sungai untuk tanggal kunjungan {new Date(visitDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}.
          </p>

          {loadingGazebos ? (
            <p style={{ color: "#666", padding: "2rem 0", fontStyle: "italic" }}>Memuat ketersediaan gazebo...</p>
          ) : (
            <div className={styles.gazeboSelectGrid}>
              <div
                className={`${styles.gazeboOptionCard} ${selectedGazeboId === null ? styles["gazeboOptionCard--selected"] : ""}`}
                onClick={() => setSelectedGazeboId(null)}
              >
                <div className={styles.gazeboOptionHeader}>
                  <strong className={styles.gazeboOptionTitle}>Tanpa Sewa Gazebo</strong>
                  <StatusBadge status="completed" label="Bebas" />
                </div>
                <p style={{ fontSize: "0.875rem", color: "#666" }}>Hanya pesan tiket masuk saja tanpa menyewa gazebo.</p>
              </div>

              {gazebos.map((gzb) => (
                <div
                  key={gzb.id}
                  className={`${styles.gazeboOptionCard} ${selectedGazeboId === gzb.id ? styles["gazeboOptionCard--selected"] : ""} ${!gzb.isAvailable ? styles["gazeboOptionCard--disabled"] : ""}`}
                  onClick={() => {
                    if (gzb.isAvailable) setSelectedGazeboId(gzb.id);
                  }}
                >
                  <div className={styles.gazeboOptionHeader}>
                    <strong className={styles.gazeboOptionTitle}>{gzb.name} ({gzb.code})</strong>
                    <StatusBadge
                      status={gzb.isAvailable ? "paid" : "expired"}
                      label={gzb.isAvailable ? "Tersedia" : "Sudah Terpesan"}
                    />
                  </div>
                  <div className={styles.gazeboOptionPrice}>{formatRupiah(gzb.price)} / hari</div>
                  <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "0.25rem" }}>
                    Cap: {gzb.capacity ? `${gzb.capacity} orang` : "6-8 orang"} — {gzb.description || "Tepi sungai"}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.formActions}>
            <Button variant="ghost" size="md" onClick={() => setStep(2)}>
              &larr; Kembali
            </Button>
            <Button variant="primary" size="md" onClick={handleStep3Next}>
              Lanjut ke Konfirmasi &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Konfirmasi & Submit */}
      {step === 4 && (
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Langkah 4: Ringkasan & Konfirmasi Pemesanan</h2>
          <p className={styles.formSubtitle}>Periksa kembali rincian pemesanan Anda sebelum melakukan konfirmasi akhir.</p>

          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Nama Pemesan:</span>
              <strong>{customerName}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Nomor WhatsApp:</span>
              <strong>{whatsappNumber}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Tanggal Kunjungan:</span>
              <strong>{new Date(visitDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
            </div>

            <div style={{ margin: "1rem 0", borderTop: "1px solid #cbd5e0", paddingTop: "0.5rem" }}>
              <strong style={{ fontSize: "0.875rem", color: "#2d3748" }}>Rincian Item Tiket & Gazebo:</strong>
              {availableTickets.map((t) => {
                const qty = ticketQuantities[t.id] || 0;
                if (qty === 0) return null;
                return (
                  <div key={t.id} className={styles.summaryRow}>
                    <span>{t.name} ({qty}x)</span>
                    <span>{formatRupiah(t.price * qty)}</span>
                  </div>
                );
              })}

              {getSelectedGazebo() && (
                <div className={styles.summaryRow}>
                  <span>{getSelectedGazebo()?.name} ({getSelectedGazebo()?.code})</span>
                  <span>{formatRupiah(getSelectedGazebo()!.price)}</span>
                </div>
              )}
            </div>

            <div className={styles.summaryTotal}>
              <span>Total Pembayaran:</span>
              <span>{formatRupiah(calculateGrandTotal())}</span>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button variant="ghost" size="md" onClick={() => setStep(3)}>
              &larr; Kembali
            </Button>
            <Button variant="accent" size="lg" loading={loading} onClick={handleSubmitBooking}>
              Konfirmasi & Buat Pemesanan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
