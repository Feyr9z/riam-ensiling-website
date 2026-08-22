import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./Card.module.scss";

interface CardProps {
  image?: { src: string; alt: string };
  meta?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  variant?: "default" | "static" | "flat";
  className?: string;
}

export default function Card({
  image,
  meta,
  title,
  description,
  footer,
  children,
  variant = "default",
  className,
}: CardProps) {
  const cn = [
    styles.card,
    variant !== "default" ? styles[`card--${variant}`] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cn}>
      {image && (
        <div className={styles.image}>
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      )}
      {(meta || title || description || children) && (
        <div className={styles.body}>
          {meta && <div className={styles.meta}>{meta}</div>}
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
          {children}
        </div>
      )}
      {footer && <div className={styles.footer}>{footer}</div>}
    </article>
  );
}
