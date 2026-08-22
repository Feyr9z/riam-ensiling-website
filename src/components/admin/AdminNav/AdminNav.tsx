"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AdminNav.module.scss";

interface AdminNavItem {
  label: string;
  href: string;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Atraksi Wisata", href: "/admin/atraksi" },
  { label: "Fasilitas", href: "/admin/fasilitas" },
  { label: "Galeri", href: "/admin/galeri" },
  { label: "Tiket", href: "/admin/tiket" },
  { label: "Gazebo", href: "/admin/gazebo" },
  { label: "Pemesanan", href: "/admin/pemesanan" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <nav className={styles.navBar} aria-label="Navigasi Admin">
      <div className={styles.inner}>
        {ADMIN_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              styles.link,
              isActive(item.href) ? styles["link--active"] : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
