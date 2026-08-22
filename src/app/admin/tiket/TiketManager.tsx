"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import { createTicket, updateTicket, deleteTicket } from "./actions";
import styles from "@/components/admin/admin-table.module.scss";

interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string | null;
  isActive: boolean;
}

export default function TiketManager({ initialItems }: { initialItems: Ticket[] }) {
  const [items, setItems] = useState<Ticket[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 15000,
    description: "",
    isActive: true,
  });

  const resetForm = () => {
    setFormData({ name: "", price: 15000, description: "", isActive: true });
    setIsAdding(false);
    setEditingId(null);
    setErrorMsg(null);
  };

  const handleEditClick = (item: Ticket) => {
    setFormData({
      name: item.name,
      price: item.price,
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
      name: formData.name.trim(),
      price: Number(formData.price) || 0,
      description: formData.description.trim() || null,
      isActive: formData.isActive,
    };

    if (editingId) {
      const res = await updateTicket(editingId, payload);
      if (res.success && res.data) {
        setItems(items.map((i) => (i.id === editingId ? res.data! : i)));
        resetForm();
      } else {
        setErrorMsg(res.errorMsg || "Gagal memperbarui tiket.");
      }
    } else {
      const res = await createTicket(payload);
      if (res.success && res.data) {
        setItems([...items, res.data]);
        resetForm();
      } else {
        setErrorMsg(res.errorMsg || "Gagal membuat tiket baru.");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jenis tiket "${name}"?`)) return;
    setLoading(true);
    const res = await deleteTicket(id);
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
          <h2>Manajemen Tiket Masuk</h2>
          <p style={{ color: "#666", fontSize: "0.875rem" }}>
            Kelola jenis tiket dan harga tiket masuk Riam Ensiling
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button variant="primary" size="sm" onClick={() => setIsAdding(true)}>
            + Tambah Tiket
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h3>{editingId ? "Edit Jenis Tiket" : "Tambah Tiket Baru"}</h3>
          {errorMsg && (
            <div style={{ color: "#e53e3e", marginBottom: "1rem", fontSize: "0.875rem", fontWeight: 600 }}>
              ⚠️ {errorMsg}
            </div>
          )}
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div>
              <label className={styles.label}>Nama Tiket * (Wajib)</label>
              <input
                required
                className={styles.input}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="misal: Tiket Masuk Dewasa"
              />
            </div>
            <div>
              <label className={styles.label}>Harga Tiket / Orang (Rp) * (Wajib)</label>
              <input
                type="number"
                required
                min={0}
                step={500}
                className={styles.input}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className={styles.fieldFull}>
              <label className={styles.label}>Deskripsi (Opsional)</label>
              <textarea
                className={styles.textarea}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Keterangan tiket, misalnya batasan umur..."
              />
            </div>
            <div>
              <label className={styles.label}>Status Aktif</label>
              <select
                className={styles.select}
                value={String(formData.isActive)}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
              >
                <option value="true">Aktif (Dapat Dipesan)</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              {editingId ? "Simpan Perubahan" : "Tambah Tiket"}
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
                <th>Nama Tiket</th>
                <th>Harga</th>
                <th>Deskripsi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Belum ada jenis tiket yang ditambahkan.
                  </td>
                </tr>
              ) : (
                items.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>{formatRupiah(item.price)}</td>
                    <td style={{ maxWidth: "300px" }}>{item.description || "-"}</td>
                    <td>
                      <StatusBadge
                        status={item.isActive ? "paid" : "expired"}
                        label={item.isActive ? "Aktif" : "Nonaktif"}
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
