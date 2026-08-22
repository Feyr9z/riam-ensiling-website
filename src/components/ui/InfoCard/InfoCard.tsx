import Image from "next/image";
import styles from "./InfoCard.module.scss";

interface InfoCardProps {
  image?: { src: string; alt: string };
  title: string;
  description?: string;
  tags?: string[];
  layout?: "vertical" | "horizontal";
  className?: string;
}

function ImagePlaceholder() {
  return (
    <div className={styles.imagePlaceholder} aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 15l-5-5L11 15l-3-3-5 5V5a1 1 0 011-1h16a1 1 0 011 1v10z" opacity="0.3" />
        <path d="M21 19H3l5-5 3 3 4-5 6 7z" />
        <circle cx="8" cy="9" r="1.5" />
      </svg>
    </div>
  );
}

export default function InfoCard({
  image,
  title,
  description,
  tags,
  layout = "vertical",
  className,
}: InfoCardProps) {
  const cn = [
    styles.card,
    layout === "horizontal" ? styles["card--horizontal"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cn}>
      <div className={styles.imageWrapper}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
