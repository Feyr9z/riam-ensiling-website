"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import styles from "./Navbar.module.scss";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Atraksi Wisata", href: "/atraksi" },
  { label: "Fasilitas", href: "/fasilitas" },
  { label: "Galeri", href: "/galeri" },
  { label: "Tiket & Gazebo", href: "/tiket-gazebo" },
  { label: "Cek Status", href: "/cek-pemesanan" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={[styles.navbar, isScrolled ? styles["navbar--scrolled"] : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Halaman Utama Riam Ensiling">
          Riam <span>Ensiling</span>
        </Link>

        <nav aria-label="Navigasi Utama">
          <ul className={styles.nav} role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className={styles.navItem}>
                <Link
                  href={item.href}
                  className={[
                    styles.navLink,
                    isActive(item.href) ? styles["navLink--active"] : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Button
            as="link"
            href="/pemesanan"
            variant="accent"
            size="sm"
          >
            Pesan Sekarang
          </Button>
        </div>

        <button
          type="button"
          className={[styles.hamburger, isMenuOpen ? styles["hamburger--open"] : ""]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={[styles.mobileMenu, isMenuOpen ? styles["mobileMenu--open"] : ""]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <nav aria-label="Navigasi Seluler">
          <ul className={styles.mobileNav} role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    styles.mobileNavLink,
                    isActive(item.href) ? styles["mobileNavLink--active"] : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.mobileCta}>
          <Button
            as="link"
            href="/pemesanan"
            variant="accent"
            size="md"
            fullWidth
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </header>
  );
}
