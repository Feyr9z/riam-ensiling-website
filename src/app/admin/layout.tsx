import type { ReactNode } from "react";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import Button from "@/components/ui/Button/Button";
import { logoutAction } from "./login/actions";
import styles from "./admin-layout.module.scss";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();

  // Login page has its own full-page wrapper
  if (!session.isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.innerHeader}>
          <Link href="/admin" className={styles.brand}>
            Riam Ensiling <span>Admin</span>
          </Link>
          <div className={styles.userArea}>
            <span className={styles.userEmail}>{session.email}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" style={{ color: "#fff" }}>
                Keluar
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
