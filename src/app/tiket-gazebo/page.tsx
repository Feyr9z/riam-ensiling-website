import type { Ticket, Gazebo } from "@prisma/client";
import prisma from "@/lib/prisma";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import Button from "@/components/ui/Button/Button";
import styles from "./tiket-gazebo.module.scss";

export const metadata = {
  title: "Tiket & Gazebo Riam Ensiling",
  description:
    "Daftar harga tiket masuk dan ketersediaan sewa gazebo tepi sungai di Riam Ensiling Desa Lumut.",
};

export default async function TiketGazeboPage() {
  let tickets: Ticket[] = [];
  let gazebos: Gazebo[] = [];

  try {
    [tickets, gazebos] = await Promise.all([
      prisma.ticket.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      }),
      prisma.gazebo.findMany({
        where: { isActive: true },
        orderBy: { code: "asc" },
      }),
    ]);
  } catch (error) {
    // Database connection fallback
  }

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <span className={styles.eyebrow}>Tarif & Layanan Reservasi</span>
          <h1 className={styles.title}>Tiket Masuk & Sewa Gazebo</h1>
          <p className={styles.subtitle}>
            Informasi lengkap daftar harga tiket masuk dan pilihan gazebo sejuk di tepi sungai Riam Ensiling untuk momen bersantai Anda.
          </p>
        </div>
      </header>

      {/* 1. Section Tiket Masuk */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Akses Wisata"
            title="Daftar Tiket Masuk Wisata"
            subtitle="Pilih kategori tiket masuk sesuai umur atau rombongan keluarga Anda."
          />

          <div className={styles.ticketGrid}>
            {tickets.map((ticket) => (
              <div key={ticket.id} className={styles.ticketCard}>
                <div>
                  <div className={styles.ticketTop}>
                    <h3 className={styles.ticketName}>{ticket.name}</h3>
                    <StatusBadge status="paid" label="Tersedia" />
                  </div>
                  <div className={styles.ticketPrice}>
                    {formatRupiah(ticket.price)} <span>/ orang</span>
                  </div>
                  <p className={styles.ticketDesc}>
                    {ticket.description || "Akses penuh ke kawasan wisata alam, sungai jernih, dan spot foto Riam Ensiling."}
                  </p>

                  <ul className={styles.perksList}>
                    <li className={styles.perkItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Akses ke area berenang sungai Riam Ensiling
                    </li>
                    <li className={styles.perkItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Penggunaan fasilitas umum (toilet, mushola, warung)
                    </li>
                    <li className={styles.perkItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Akses ke spot swafoto dan tebing pemandangan
                    </li>
                  </ul>
                </div>

                <Button as="link" href="/pemesanan" variant="primary" size="md" fullWidth>
                  Pesan Tiket Ini
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Section Catalog Gazebo */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Kenyamanan Bersantai"
            title="Katalog Sewa Gazebo Tepi Sungai"
            subtitle="Amankan gazebo favorit Anda secara online untuk menjamin tempat istirahat yang sejuk pada hari kunjungan."
          />

          <div className={styles.gazeboGrid}>
            {gazebos.map((gzb) => (
              <div key={gzb.id} className={styles.gazeboCard}>
                <div>
                  <div className={styles.gazeboHeader}>
                    <span className={styles.codeBadge}>{gzb.code}</span>
                    <StatusBadge status="paid" label="Tersedia" />
                  </div>

                  <h3 className={styles.gazeboName}>{gzb.name}</h3>

                  <div className={styles.gazeboDetails}>
                    <div className={styles.detailItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                      </svg>
                      Cap: {gzb.capacity ? `${gzb.capacity} orang` : "6-8 orang"}
                    </div>

                    <div className={styles.detailItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Tepi Sungai
                    </div>
                  </div>

                  <div className={styles.gazeboPrice}>
                    {formatRupiah(gzb.price)} <span>/ hari</span>
                  </div>

                  <p className={styles.gazeboDesc}>
                    {gzb.description || "Gazebo kayu sejuk dengan pemandangan langsung ke alur air sungai Riam Ensiling."}
                  </p>
                </div>

                <Button as="link" href="/pemesanan" variant="accent" size="md" fullWidth>
                  Pesan Gazebo ini
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Section Kebijakan & Ketentuan Booking */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Syarat & Ketentuan"
            title="Kebijakan Pemesanan & Sewa"
            subtitle="Beberapa informasi penting sebelum Anda melakukan pemesanan tiket dan gazebo secara online:"
            align="center"
          />

          <div className={styles.policyGrid}>
            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <h3 className={styles.policyTitle}>Waktu Check-in & Operasional</h3>
                <p className={styles.policyDesc}>
                  Gazebo yang Anda pesan berlaku selama 1 hari penuh pada tanggal kunjungan pilihan Anda (08:00 - 17:00 WIB). Tunjukkan e-tiket / QR code pemesanan kepada petugas di lokasi.
                </p>
              </div>
            </div>

            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <div>
                <h3 className={styles.policyTitle}>Pembayaran Otomatis & Instan</h3>
                <p className={styles.policyDesc}>
                  Pembayaran didukung via QRIS (GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, dll) & Virtual Account otomatis melalui gerbang pembayaran aman Midtrans.
                </p>
              </div>
            </div>

            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.policyTitle}>Pencegahan Double-Booking Gazebo</h3>
                <p className={styles.policyDesc}>
                  Setiap gazebo yang telah dibayar pada tanggal tertentu otomatis terkunci dan tidak dapat dipesan oleh pengunjung lain pada tanggal yang sama.
                </p>
              </div>
            </div>

            <div className={styles.policyCard}>
              <div className={styles.policyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 className={styles.policyTitle}>Bantuan & Layanan Informasi</h3>
                <p className={styles.policyDesc}>
                  Jika terjadi kendala saat pemesanan, Anda dapat mengecek status di menu Cek Status atau menghubungi pengelola via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.ctaBox}>
            <h2>Siap Melakukan Pemesanan Online?</h2>
            <p>Pilih tanggal kunjungan dan amankan tiket masuk serta gazebo pilihan Anda tanpa antre.</p>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Mulai Pemesanan Sekarang &rarr;
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
