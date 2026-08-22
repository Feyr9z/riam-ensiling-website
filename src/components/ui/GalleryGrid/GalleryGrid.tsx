import Image from "next/image";
import styles from "./GalleryGrid.module.scss";

interface GalleryItem {
  id: number | string;
  image_url: string;
  sort_order?: number;
}

interface GalleryGridProps {
  items: GalleryItem[];
  /** Max items to show — defaults to all */
  limit?: number;
}

function ImagePlaceholder() {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" opacity="0.2" />
        <path d="M21 15l-5-5L11 15l-3-3-5 5" opacity="0.5" />
        <circle cx="8.5" cy="8.5" r="1.5" />
      </svg>
    </div>
  );
}

export default function GalleryGrid({ items, limit }: GalleryGridProps) {
  const displayed = limit ? items.slice(0, limit) : items;

  if (displayed.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid} role="list" aria-label="Galeri foto">
      {displayed.map((item) => (
        <div key={item.id} className={styles.item} role="listitem">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt="Foto galeri Riam Ensiling"
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      ))}
    </div>
  );
}
