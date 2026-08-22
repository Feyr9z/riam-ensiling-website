"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Footer.module.scss";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Atraksi Wisata", href: "/atraksi" },
  { label: "Fasilitas", href: "/fasilitas" },
  { label: "Galeri", href: "/galeri" },
];

const BOOKING_LINKS = [
  { label: "Tiket & Gazebo", href: "/tiket-gazebo" },
  { label: "Pesan Sekarang", href: "/pemesanan" },
  { label: "Cek Status Pemesanan", href: "/cek-pemesanan" },
  { label: "Kontak & Lokasi", href: "/kontak" },
];

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.556 4.124 1.528 5.853L0 24l6.388-1.509A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.504-5.18-1.385l-.371-.22-3.795.896.952-3.682-.241-.383A9.944 9.944 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z"/>
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.main}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Riam Ensiling
          </Link>
          <p className={styles.tagline}>
            Wisata alam yang memukau di jantung Kalimantan Barat.
            Nikmati keindahan alam, budaya, dan ketenangan bersama keluarga.
          </p>
          <div className={styles.social}>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="Instagram Riam Ensiling"
              title="Instagram"
            >
              <IconInstagram />
            </a>
            <a
              href="#"
              className={styles.socialLink}
              aria-label="WhatsApp Riam Ensiling"
              title="WhatsApp"
            >
              <IconWhatsApp />
            </a>
          </div>
        </div>

        <div className={styles.column}>
          <p className={styles.columnTitle}>Navigasi</p>
          <ul className={styles.columnLinks} role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <p className={styles.columnTitle}>Pemesanan</p>
          <ul className={styles.columnLinks} role="list">
            {BOOKING_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className={styles.columnTitle} style={{ marginTop: "1rem" }}>Lokasi</p>
          <div className={styles.contactItem}>
            <IconMapPin />
            <span>Desa Lumut, Kec. Toba, Kab. Sanggau, Kalimantan Barat</span>
          </div>
          <div className={styles.contactItem}>
            <IconClock />
            <span>Jam Operasional: 08:00 - 17:00 WIB</span>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            &copy; {currentYear} Riam Ensiling. Hak cipta dilindungi.
          </p>
          <p className={styles.disclaimer}>
            Demo untuk keperluan thesis — bukan data resmi operasional.
          </p>
        </div>
      </div>
    </footer>
  );
}
