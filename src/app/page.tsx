import { Attraction, Facility, GalleryItem as PrismaGalleryItem, Ticket, Gazebo } from "@prisma/client";
import prisma from "@/lib/prisma";
import Hero from "@/components/ui/Hero/Hero";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import Card from "@/components/ui/Card/Card";
import Button from "@/components/ui/Button/Button";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import GalleryGrid from "@/components/ui/GalleryGrid/GalleryGrid";
import styles from "./page.module.scss";

export const metadata = {
  title: "Beranda — Riam Ensiling",
  description:
    "Destinasi wisata alam Riam Ensiling di Desa Lumut, Kabupaten Sanggau. Informasi daya tarik wisata, fasilitas, tiket masuk, dan sewa gazebo online.",
};

export default async function HomePage() {
  let attractions: Attraction[] = [];
  let facilities: Facility[] = [];
  let galleryItems: PrismaGalleryItem[] = [];
  let tickets: Ticket[] = [];
  let gazebos: Gazebo[] = [];

  try {
    [attractions, facilities, galleryItems, tickets, gazebos] = await Promise.all([
      prisma.attraction.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.facility.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.galleryItem.findMany({
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      prisma.ticket.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      }),
      prisma.gazebo.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      }),
    ]);
  } catch (error) {
    // Database fallback if connection is starting
  }

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      {/* 1. Hero Section */}
      <Hero
        backgroundImage={{
          src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=85",
          alt: "Pemandangan Air Terjun dan Sungai Riam Ensiling",
        }}
        eyebrow="Destinasi Wisata Alam Sanggau"
        title={
          <>
            Pesona Keasrian Alam <span>Riam Ensiling</span>
          </>
        }
        subtitle="Rasakan kesejukan gemuruh air terjun alami, kejernihan sungai, dan kenyamanan sewa gazebo tepi sungai di Desa Lumut, Kabupaten Sanggau."
        actions={
          <>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Pesan Tiket & Gazebo
            </Button>
            <Button as="link" href="#atraksi-wisata" variant="ghost" size="lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              Jelajahi Wisata
            </Button>
          </>
        }
      />

      {/* 2. Stats / Highlights Banner */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid4}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className={styles.statTitle}>Terjangkau</h3>
              <p className={styles.statDesc}>Tiket masuk mulai Rp 10.000 / orang</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <h3 className={styles.statTitle}>Gazebo Nyaman</h3>
              <p className={styles.statDesc}>Gazebo sejuk tepi riam sungai</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className={styles.statTitle}>Buka Setiap Hari</h3>
              <p className={styles.statDesc}>Pukul 08.00 - 17.00 WIB</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className={styles.statTitle}>Booking Online</h3>
              <p className={styles.statDesc}>Pesan tiket & gazebo tanpa antre</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ringkasan Atraksi Wisata */}
      <section id="atraksi-wisata" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Daya Tarik Alam"
            title="Atraksi Wisata Unggulan"
            subtitle="Temukan keindahan lokasi alami Riam Ensiling yang siap memanjakan momen liburan Anda."
            align="center"
          />

          <div className={styles.grid3}>
            {attractions.slice(0, 3).map((attr) => (
              <Card
                key={attr.id}
                image={{
                  src: attr.imageUrl || "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
                  alt: attr.name,
                }}
                meta={<StatusBadge status="paid" label="Atraksi Wisata" />}
                title={attr.name}
                description={attr.description}
              />
            ))}
          </div>

          <div className={styles.moreLinkWrapper}>
            <Button as="link" href="/atraksi" variant="secondary" size="md">
              Lihat Semua Atraksi Wisata &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Fasilitas Usaha Wisata */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Kenyamanan Anda"
            title="Fasilitas Usaha Wisata"
            subtitle="Berbagai sarana penunjang telah disediakan untuk memberikan kenyamanan ekstra bagi pengunjung."
            align="center"
          />

          <div className={styles.grid3}>
            {facilities.slice(0, 3).map((fac) => (
              <Card
                key={fac.id}
                image={{
                  src: fac.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
                  alt: fac.name,
                }}
                meta={<StatusBadge status="completed" label="Fasilitas" />}
                title={fac.name}
                description={fac.description}
              />
            ))}
          </div>

          <div className={styles.moreLinkWrapper}>
            <Button as="link" href="/fasilitas" variant="secondary" size="md">
              Lihat Seluruh Fasilitas &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Galeri Foto Highlights */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Dokumentasi Visual"
            title="Galeri Keindahan Riam Ensiling"
            subtitle="Sekilas potret keasrian alam dan suasana santai di Riam Ensiling."
            align="center"
          />

          <GalleryGrid
            items={galleryItems.map((item) => ({
              id: item.id,
              image_url: item.imageUrl,
            }))}
          />

          <div className={styles.moreLinkWrapper}>
            <Button as="link" href="/galeri" variant="secondary" size="md">
              Buka Galeri Foto Lengkap &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Info Tiket & Gazebo Summary */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Pilihan Layanan"
            title="Tiket Masuk & Sewa Gazebo"
            subtitle="Rencanakan kunjungan Anda dengan mudah. Pesan tiket dan sewa gazebo secara online."
            align="center"
          />

          <div className={styles.grid2}>
            <div className={styles.priceCard}>
              <div>
                <div className={styles.priceHeader}>
                  <h3 className={styles.priceTitle}>Tiket Masuk Wisata</h3>
                  <div className={styles.priceTag}>
                    {tickets.length > 0 ? formatRupiah(tickets[0].price) : "Rp 10.000"} <span>/ orang</span>
                  </div>
                </div>
                <p className={styles.priceDesc}>
                  Akses masuk kawasan objek wisata alam Riam Ensiling, menikmati aliran sungai, berenang, dan area santai.
                </p>
              </div>
              <Button as="link" href="/pemesanan" variant="primary" size="md" fullWidth>
                Pesan Tiket Sekarang
              </Button>
            </div>

            <div className={styles.priceCard}>
              <div>
                <div className={styles.priceHeader}>
                  <h3 className={styles.priceTitle}>Sewa Gazebo Tepi Sungai</h3>
                  <div className={styles.priceTag}>
                    {gazebos.length > 0 ? formatRupiah(gazebos[0].price) : "Rp 50.000"} <span>/ hari</span>
                  </div>
                </div>
                <p className={styles.priceDesc}>
                  Pilihan gazebo sejuk dan nyaman di pinggir aliran riam sungai untuk tempat berkumpul dan makan bersama keluarga.
                </p>
              </div>
              <Button as="link" href="/pemesanan" variant="accent" size="md" fullWidth>
                Pesan Gazebo Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Big Booking CTA Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Siap Menikmati Keasrian Riam Ensiling?</h2>
            <p className={styles.ctaDesc}>
              Hindari antrean di lokasi. Pesan tiket masuk dan amankan tempat gazebo favorit Anda secara langsung melalui platform booking online resmi.
            </p>
            <div className={styles.ctaActions}>
              <Button as="link" href="/pemesanan" variant="accent" size="lg">
                Pesan Tiket & Gazebo Online
              </Button>
              <Button as="link" href="/cek-pemesanan" variant="ghost" size="lg" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
                Cek Status Booking
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Lokasi & Jam Operasional */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.locationGrid}>
            <div className={styles.locationInfo}>
              <SectionHeader
                eyebrow="Petunjuk Arah"
                title="Lokasi & Jam Operasional"
                subtitle="Kunjungi Riam Ensiling untuk pengalaman berwisata alam yang tak terlupakan."
              />

              <ul className={styles.infoList}>
                <li className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className={styles.infoText}>
                    <strong>Alamat Lengkap</strong>
                    <span>Desa Lumut, Kecamatan Toba, Kabupaten Sanggau, Kalimantan Barat</span>
                  </div>
                </li>

                <li className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className={styles.infoText}>
                    <strong>Jam Operasional</strong>
                    <span>Senin — Minggu: 08.00 - 17.00 WIB</span>
                  </div>
                </li>

                <li className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className={styles.infoText}>
                    <strong>Kontak Informasi</strong>
                    <span>WhatsApp / Telepon Pengelola: 0812-3456-7890</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.mapCard}>
              <div className={styles.mapIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              </div>
              <h3>Riam Ensiling, Desa Lumut</h3>
              <p>
                Akses mudah dengan kendaraan bermotor dan roda empat. Nikmati perjalanan sejuk menuju kawasan objek wisata.
              </p>
              <Button as="link" href="/kontak" variant="secondary" size="md">
                Lihat Peta & Informasi Kontak &rarr;
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
