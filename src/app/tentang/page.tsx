import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import Button from "@/components/ui/Button/Button";
import styles from "./tentang.module.scss";

export const metadata = {
  title: "Tentang Riam Ensiling",
  description:
    "Mengenal profil destinasi wisata alam Riam Ensiling di Desa Lumut, Kabupaten Sanggau, Kalimantan Barat.",
};

export default function TentangPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profil Destinasi Wisata"
        title="Tentang Riam Ensiling"
        subtitle="Menyuguhkan keindahan panorama sungai jernih, gemuruh air terjun alami, dan keramahan budaya khas Desa Lumut, Kabupaten Sanggau."
      />

      {/* Story & Background */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyImage}>
              <Image
                src="https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80"
                alt="Sungai dan Keasrian Alam Riam Ensiling"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className={styles.storyContent}>
              <h2>Keasrian Alam yang Terjaga</h2>
              <p>
                Riam Ensiling merupakan salah satu destinasi wisata alam unggulan yang terletak di Desa Lumut, Kecamatan Toba, Kabupaten Sanggau, Kalimantan Barat. Terkenal dengan alur riam sungai yang jernih dan pepohonan hijau yang rindang, tempat ini menawarkan suasana menenangkan bagi siapa saja yang ingin melepas penat dari hiruk-pikuk perkotaan.
              </p>
              <p>
                Dikelola bersama masyarakat setempat, Riam Ensiling berkomitmen untuk melestarikan lingkungan sekitar sekaligus memberikan pelayanan terbaik bagi wisatawan lokal maupun mancanegara.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Utama */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <SectionHeader
            eyebrow="Nilai Utama Kami"
            title="Mengapa Berkunjung ke Riam Ensiling?"
            subtitle="Kami mengutamakan kelestarian alam dan kenyamanan pengunjung."
            align="center"
          />

          <div className={styles.grid3}>
            <div className={styles.featureBox}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Kelestarian Lingkungan</h3>
              <p>
                Kawasan wisata yang terus dijaga kebersihannya dan dipertahankan keasrian vegetasi hutan di sekitarnya.
              </p>
            </div>

            <div className={styles.featureBox}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Ramah Keluarga</h3>
              <p>
                Area riam sungai yang aman untuk berenang serta gazebo tepi sungai yang nyaman untuk berkumpul keluarga.
              </p>
            </div>

            <div className={styles.featureBox}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M7 15h0M2 9.5h20" />
                </svg>
              </div>
              <h3>Kemudahan Booking Online</h3>
              <p>
                Sistem tiket dan pemesanan sewa gazebo berbasis online untuk menjamin kepastian reservasi tanpa antre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tata Tertib Pengunjung */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            eyebrow="Panduan Wisatawan"
            title="Tata Tertib & Himbauan Pengunjung"
            subtitle="Demi keselamatan dan kenyamanan bersama, seluruh pengunjung wajib mematuhi aturan berikut:"
            align="center"
          />

          <ul className={styles.rulesList}>
            <li className={styles.ruleItem}>
              <div className={styles.ruleIcon}>1</div>
              <div className={styles.ruleText}>
                <strong>Menjaga Kebersihan Lingkungan</strong>
                <span>Dilarang keras membuang sampah di aliran sungai maupun kawasan wisata. Gunakan tempat sampah yang telah disediakan.</span>
              </div>
            </li>

            <li className={styles.ruleItem}>
              <div className={styles.ruleIcon}>2</div>
              <div className={styles.ruleText}>
                <strong>Pengawasan Anak-anak</strong>
                <span>Orang tua / pendamping wajib senantiasa mengawasi anak-anak saat bermain air di tepi riam sungai.</span>
              </div>
            </li>

            <li className={styles.ruleItem}>
              <div className={styles.ruleIcon}>3</div>
              <div className={styles.ruleText}>
                <strong>Menjaga Ketenangan & Ketertiban</strong>
                <span>Dilarang membawa barang-barang berbahaya, minuman keras, atau melakukan tindakan yang mengganggu pengunjung lain.</span>
              </div>
            </li>

            <li className={styles.ruleItem}>
              <div className={styles.ruleIcon}>4</div>
              <div className={styles.ruleText}>
                <strong>Merawat Fasilitas Gazebo</strong>
                <span>Pengguna gazebo diharapkan menjaga kebersihan dan tidak merusak fasilitas sarana prasarana yang ada.</span>
              </div>
            </li>
          </ul>

          <div className={styles.ctaBox}>
            <h2>Rencanakan Kunjungan Anda Sekarang</h2>
            <p>Dapatkan kepastian tiket dan gazebo pilihan Anda secara langsung melalui sistem pemesanan online.</p>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Pesan Tiket & Gazebo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
