"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { createGalleryItem, deleteGalleryItem } from "./actions";
import styles from "@/components/admin/admin-table.module.scss";

interface GalleryItem {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

export default function GaleriManager({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await createGalleryItem({ imageUrl: imageUrl.trim() });
    if (res.success && res.data) {
      setItems([...items, res.data]);
      setImageUrl("");
      setIsAdding(false);
    } else {
      setErrorMsg(res.errorMsg || "Gagal mengunggah/menambah foto.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini dari galeri?")) return;
    setLoading(true);
    const res = await deleteGalleryItem(id);
    if (res.success) {
      setItems(items.filter((i) => i.id !== id));
    } else {
      alert(res.errorMsg || "Gagal menghapus foto.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Galeri Foto Riam Ensiling</h1>
        {!isAdding && (
          <Button variant="primary" size="md" onClick={() => setIsAdding(true)}>
            + Tambah Foto Galeri
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>Tambah Foto Galeri Baru</h2>
          </div>

          {errorMsg && (
            <div style={{ color: "#c0392b", backgroundColor: "#fdecea", padding: "0.75rem", borderRadius: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div className={styles.formGrid}>
            <div className={styles.fieldFull}>
              <label className={styles.label}>URL Gambar / Foto *</label>
              <input
                required
                className={styles.input}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... atau /images/galeri/foto.jpg"
              />
            </div>
          </div>

          {imageUrl.trim() && (
            <div style={{ marginTop: "1rem" }}>
              <label className={styles.label}>Pratinjau Foto:</label>
              <div className={styles.galleryImgWrapper} style={{ maxWidth: "320px", height: "180px" }}>
                <Image src={imageUrl.trim()} alt="Pratinjau" fill sizes="320px" style={{ objectFit: "cover" }} />
              </div>
            </div>
          )}

          <div className={styles.actions} style={{ marginTop: "1.5rem" }}>
            <Button type="submit" variant="primary" size="md" loading={loading}>
              Simpan ke Galeri
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={() => setIsAdding(false)}>
              Batal
            </Button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className={styles.tableCard}>
          <div className={styles.emptyState}>
            <p>Belum ada foto yang diunggah ke dalam galeri.</p>
          </div>
        </div>
      ) : (
        <div className={styles.galleryGrid}>
          {items.map((item, idx) => (
            <div key={item.id} className={styles.galleryCard}>
              <div className={styles.galleryImgWrapper}>
                <Image
                  src={item.imageUrl}
                  alt={`Foto Galeri ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.galleryCardBody}>
                <span className={styles.badgeNumber}>Foto #{idx + 1}</span>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
