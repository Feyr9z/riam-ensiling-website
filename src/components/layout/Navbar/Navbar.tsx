"use client";

import { useState, useEffect, useCallback } from "react";
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
  { label: "Atraksi", href: "/atraksi" },
  { label: "Fasilitas", href: "/fasilitas" },
  { label: "Galeri", href: "/galeri" },
  { label: "Tiket & Gazebo", href: "/tiket-gazebo" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const navbarClass = [
    styles.navbar,
    isScrolled ? styles["navbar--scrolled"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={navbarClass}>
      <div className={styles.inner}>
        {/* Logo / Wordmark */}
        <Link href="/" className={styles.logo} aria-label="Riam Ensiling — Beranda">
          Riam Ensiling
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Navigasi utama">
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

        {/* Desktop CTA */}
        <div className={styles.actions}>
          <Button as="link" href="/pemesanan" variant="primary" size="sm">
            Pesan Sekarang
          </Button>
        </div>

        {/* Hamburger button (mobile) */}
        <button
          id="navbar-menu-toggle"
          className={[
            styles.hamburger,
            isMenuOpen ? styles["hamburger--open"] : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="navbar-mobile-menu"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          <span className={styles.hamburgerLine} aria-hidden="true" />
          <span className={styles.hamburgerLine} aria-hidden="true" />
          <span className={styles.hamburgerLine} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="navbar-mobile-menu"
        className={[
          styles.mobileMenu,
          isMenuOpen ? styles["mobileMenu--open"] : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <nav aria-label="Navigasi mobile">
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
                  tabIndex={isMenuOpen ? 0 : -1}
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
            variant="primary"
            fullWidth
            tabIndex={isMenuOpen ? 0 : -1}
          >
            Pesan Sekarang
          </Button>
        </div>
      </div>
    </header>
  );
}
