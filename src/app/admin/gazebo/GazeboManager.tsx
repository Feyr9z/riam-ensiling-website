"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import { createGazebo, updateGazebo, deleteGazebo } from "./actions";
import styles from "@/components/admin/admin-table.module.scss";

interface Gazebo {
  id: string;
  code: string;
  name: string;
  price: number;
  capacity: number | null;
  description: string | null;
  isActive: boolean;
}

export default function GazeboManager({ initialItems }: { initialItems: Gazebo[] }) {
  const [items, setItems] = useState<Gazebo[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    price: 50000,
    capacity: 6,
    description: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({ code: "", name: "", price: 50000, capacity: 6, description: "", isActive: true });
    setIsAdding(false);
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleEditClick = (item: Gazebo) => {
    setFormData({
      code: item.code,
      name: item.name,
      price: item.price,
      capacity: item.capacity ?? 6,
      description: item.description ?? "",
      isActive: item.isActive,
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
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      price: Number(formData.price) || 0,
      capacity: formData.capacity ? Number(formData.capacity) : null,
      description: formData.description.trim() || null,
      isActive: formData.isActive,
    };

    if (editingId) {
      const res = await updateGazebo(editingId, payload);
      if (res.success && res.data) {
        setItems(items.map((i) => (i.id === editingId ? res.data! : i)));
        resetForm();
      } else {
        setErrorMsg(res.errorMsg || "Gagal menyimpan perubahan.");
      }
    } else {
      const res = await createGazebo(payload);
      if (res.success && res.data) {
        setItems([...items, res.data]);
        resetForm();
      } else {
        setErrorMsg(res.errorMsg || "Gagal membuat gazebo.");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${name}"?`)) return;
    setLoading(true);
    const res = await deleteGazebo(id);
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

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h2>Manajemen Sewa Gazebo</h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Kelola data gazebo, ketersediaan, dan tarif sewa per hari
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
            + Tambah Gazebo
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h3>{editingId ? "Edit Data Gazebo" : "Tambah Gazebo Baru"}</h3>
          {errorMsg && (
            <div style={{ color: "#e53e3e", marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 600 }}>
              ⚠️ {errorMsg}
            </div>
          )}
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div>
              <label className={styles.label}>Kode Gazebo * (Wajib, Unik, contoh: GZB-C1)</label>
              <input
                required
                className={styles.input}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="misal: GZB-C1"
              />
            </div>
            <div>
              <label className={styles.label}>Nama Gazebo * (Wajib)</label>
              <input
                required
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="misal: Gazebo C1 (Area Taman)"
              />
            </div>
            <div>
              <label className={styles.label}>Harga Sewa / Hari (Rp) * (Wajib)</label>
              <input
                type="number"
                required
                min={0}
                step={5000}
                className={styles.input}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className={styles.label}>Kapasitas Maksimal (Orang) (Opsional)</label>
              <input
                type="number"
                min={1}
                className={styles.input}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                placeholder="misal: 6"
              />
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Deskripsi & Catatan Lokasi (Opsional)</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Petunjuk lokasi, fasilitas terdekat, atau catatan gazebo..."
              />
            </div>
            <div>
              <label className={styles.label}>Status Ketersediaan</label>
              <select
                className={styles.select}
                value={String(formData.isActive)}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
              >
                <option value="true">Aktif (Dapat Disewa)</option>
                <option value="false">Nonaktif / Perbaikan</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              {editingId ? "Simpan Perubahan" : "Tambah Gazebo"}
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
                <th>Kode</th>
                <th>Nama Gazebo</th>
                <th>Kapasitas</th>
                <th>Harga Sewa</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyState}>
                    Belum ada gazebo yang ditambahkan.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <code style={{ background: "#edf2f7", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>
                        {item.code}
                      </code>
                    </td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{item.capacity ? `${item.capacity} orang` : "-"}</td>
                    <td>{formatRupiah(item.price)}</td>
                    <td>
                      <StatusBadge
                        status={item.isActive ? "paid" : "expired"}
                        label={item.isActive ? "Tersedia" : "Nonaktif"}
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
