"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import { createAttraction, updateAttraction, deleteAttraction } from "./actions";
import styles from "@/components/admin/admin-table.module.scss";

interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export default function AtraksiManager({ initialItems }: { initialItems: Attraction[] }) {
  const [items, setItems] = useState<Attraction[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isPublished: true,
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", imageUrl: "", isPublished: true });
    setIsAdding(false);
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleEditClick = (item: Attraction) => {
    setFormData({
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl ?? "",
      isPublished: item.isPublished,
    });
    setEditingId(item.id);
    setIsAdding(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim() || null,
      isPublished: formData.isPublished,
    };

    if (editingId) {
      const res = await updateAttraction(editingId, payload);
      if (res.success && res.data) {
        setItems(items.map((i) => (i.id === editingId ? res.data! : i)));
        resetForm();
      } else {
        setErrorMsg(res.errorMsg || "Gagal memperbarui data.");
      }
    } else {
      const res = await createAttraction(payload);
      if (res.success && res.data) {
        setItems([...items, res.data]);
        resetForm();
      } else {
        setErrorMsg(res.errorMsg || "Gagal menambah atraksi wisata.");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus atraksi wisata "${name}"?`)) return;
    setLoading(true);
    const res = await deleteAttraction(id);
    if (res.success) {
      setItems(items.filter((i) => i.id !== id));
      if (editingId === id) {
        resetForm();
      }
    } else {
      alert(res.errorMsg || "Gagal menghapus.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>Manajemen Atraksi Wisata</h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Kelola daftar objek dan daya tarik wisata Riam Ensiling
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
            + Tambah Atraksi Wisata
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h3>{editingId ? "Edit Atraksi Wisata" : "Tambah Atraksi Wisata Baru"}</h3>
          {errorMsg && (
            <div style={{ color: "#e53e3e", marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 600 }}>
              ⚠️ {errorMsg}
            </div>
          )}
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div>
              <label className={styles.label}>Nama Atraksi Wisata *</label>
              <input
                required
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="misal: Air Terjun Riam Ensiling"
              />
            </div>
            <div>
              <label className={styles.label}>URL Gambar (Opsional)</label>
              <input
                className={styles.input}
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Deskripsi *</label>
              <textarea
                required
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan daya tarik dan keunikan atraksi wisata ini..."
              />
            </div>
            <div>
              <label className={styles.label}>Status Publikasi</label>
              <select
                className={styles.select}
                value={String(formData.isPublished)}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.value === "true" })}
              >
                <option value="true">Dipublikasikan</option>
                <option value="false">Draf / Sembunyi</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              {editingId ? "Simpan Perubahan" : "Tambah Atraksi Wisata"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
              Batal
            </Button>
          </div>
        </form>
      )}

      <div className={styles.tableCard}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "60px" }}>No</th>
                <th>Nama Atraksi Wisata</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    Belum ada atraksi wisata yang ditambahkan.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td style={{ maxWidth: "300px" }}>{item.description}</td>
                    <td>
                      <StatusBadge
                        status={item.isPublished ? "paid" : "expired"}
                        label={item.isPublished ? "Aktif" : "Draf"}
                      />
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button variant="secondary" size="sm" onClick={() => handleEditClick(item)}>
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
