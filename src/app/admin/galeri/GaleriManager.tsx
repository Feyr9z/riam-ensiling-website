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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState("");

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
      setErrorMsg(res.errorMsg || "Gagal menambah foto ke galeri.");
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
      alert(res.errorMsg || "Gagal menghapus.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>Manajemen Galeri Foto</h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Kelola koleksi foto keindahan alam Riam Ensiling
          </p>
        </div>
        {!isAdding && (
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
            + Tambah Foto
          </Button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h3>Tambah Foto Baru ke Galeri</h3>
          {errorMsg && (
            <div style={{ color: "#e53e3e", marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 600 }}>
              ⚠️ {errorMsg}
            </div>
          )}
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div className={styles.fieldFull}>
              <label className={styles.label}>URL Gambar *</label>
              <input
                required
                className={styles.input}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              Tambah ke Galeri
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Batal
            </Button>
          </div>
        </form>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            className={styles.tableCard}
            style={{ padding: "0.75rem", position: "relative" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4 / 3",
                borderRadius: "0.5rem",
                overflow: "hidden",
                marginBottom: "0.5rem",
              }}
            >
              <Image
                src={item.imageUrl}
                alt="Foto galeri"
                fill
                sizes="250px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#666" }}>No. {idx + 1}</span>
              <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
