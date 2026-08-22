import type { ReactNode } from "react";
import styles from "./PageHeader.module.scss";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}

export default function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div className={`container ${styles.inner}`}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </header>
  );
}
