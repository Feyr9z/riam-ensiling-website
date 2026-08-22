import type { ReactNode } from "react";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  size?: "md" | "lg";
  align?: "center" | "left";
  onDark?: boolean;
  className?: string;
  /** Heading level — defaults to h2 */
  as?: "h1" | "h2" | "h3";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  size = "md",
  align = "center",
  onDark = false,
  className,
  as: Tag = "h2",
}: SectionHeaderProps) {
  const headerClass = [
    styles.header,
    align === "left" ? styles["header--left"] : "",
    onDark ? styles["header--on-dark"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={headerClass}>
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <Tag className={[styles.title, styles[`title--${size}`]].join(" ")}>
        {title}
      </Tag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
