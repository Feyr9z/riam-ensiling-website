import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./Hero.module.scss";

interface HeroProps {
  /** Background image — required for hero sections */
  backgroundImage: { src: string; alt: string };
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  showScrollIndicator?: boolean;
}

export default function Hero({
  backgroundImage,
  eyebrow,
  title,
  subtitle,
  actions,
  showScrollIndicator = true,
}: HeroProps) {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Background image */}
      <div className={styles.bg} aria-hidden="true">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Content */}
      <div className={styles.content}>
        {eyebrow && (
          <span className={styles.eyebrow}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="6" cy="6" r="5" />
            </svg>
            {eyebrow}
          </span>
        )}
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <svg
            className={styles.scrollArrow}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>
      )}
    </section>
  );
}
