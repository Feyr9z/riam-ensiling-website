"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./GalleryViewer.module.scss";

interface GalleryItem {
  id: string;
  imageUrl: string;
}

export default function GalleryViewer({ items }: { items: GalleryItem[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, items.length]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : items.length - 1));
  }, [selectedIndex, items.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    },
    [selectedIndex, handleNext, handlePrev]
  );

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, handleKeyDown]);

  return (
    <>
      <div className={styles.grid}>
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={styles.item}
            onClick={() => setSelectedIndex(idx)}
            role="button"
            tabIndex={0}
            aria-label={`Buka foto ke-${idx + 1}`}
          >
            <Image
              src={item.imageUrl}
              alt={`Foto Galeri Riam Ensiling ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: "cover" }}
            />
            <div className={styles.overlay}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className={`${styles.lightbox} ${styles["lightbox--open"]}`}
          onClick={() => setSelectedIndex(null)}
          aria-modal="true"
          role="dialog"
        >
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setSelectedIndex(null)}
              aria-label="Tutup peninjau foto"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnPrev}`}
              onClick={handlePrev}
              aria-label="Foto sebelumnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.imageWrapper}>
              <Image
                src={items[selectedIndex].imageUrl}
                alt={`Foto Galeri ${selectedIndex + 1}`}
                fill
                priority
                sizes="90vw"
                style={{ objectFit: "contain" }}
              />
            </div>

            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={handleNext}
              aria-label="Foto selanjutnya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
