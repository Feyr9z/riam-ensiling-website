# Riam Ensiling Website

Website informasi wisata dan pemesanan tiket/gazebo untuk **Riam Ensiling**, dibangun dengan Next.js (App Router) + TypeScript.

> ⚠️ Proyek ini adalah implementasi untuk keperluan thesis demo. Data operasional (harga, nomor kontak, jam buka, dll.) menggunakan placeholder dan belum merepresentasikan data resmi.

---

## Prasyarat

- [Node.js](https://nodejs.org/) v20+
- [Docker](https://www.docker.com/) & Docker Compose v2+
- [Git](https://git-scm.com/)

---

## Cara Menjalankan (via Docker Compose)

```bash
# 1. Clone repo
git clone https://github.com/Feyr9z/riam-ensiling-website.git
cd riam-ensiling-website

# 2. Buat file .env dari contoh
cp .env.example .env
# Edit .env dan isi nilai yang sesuai (terutama ADMIN_SESSION_SECRET dan Midtrans keys)

# 3. Jalankan semua service
docker compose up -d

# 4. (Pertama kali) Jalankan migrasi database
docker compose exec app npm run db:migrate

# 5. (Pertama kali) Seed data demo
docker compose exec app npm run db:seed

# 6. Buka di browser
# http://localhost:3000
```

---

## Development Lokal (tanpa Docker)

```bash
npm install
# Pastikan MySQL sudah berjalan dan DATABASE_URL di .env sudah benar
npm run db:migrate
npm run db:seed
npm run dev
```

---

## Login Admin (Demo)

> Kredensial berikut hanya untuk sandbox demo. Ganti sebelum deployment production.

- **URL:** `http://localhost:3000/admin`
- **Email:** `admin@riamensiling.id` *(seeded)*
- **Password:** `admin123` *(seeded — ganti segera di production)*

---

## Pembayaran Sandbox Midtrans

Proyek ini menggunakan **Midtrans Sandbox** — tidak ada transaksi uang nyata.

1. Daftarkan akun di [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com)
2. Salin `Server Key` dan `Client Key` ke `.env`
3. Set URL notifikasi webhook ke: `http://<ngrok-atau-tunnel-kamu>/api/payments/midtrans/notification`
4. Gunakan QRIS simulasi di checkout Snap untuk menyelesaikan pembayaran

---

## Struktur Halaman Publik

| Path | Halaman |
|------|---------|
| `/` | Beranda |
| `/tentang` | Tentang Riam Ensiling |
| `/atraksi` | Daya Tarik |
| `/fasilitas` | Fasilitas |
| `/galeri` | Galeri |
| `/tiket-gazebo` | Tiket & Gazebo |
| `/pemesanan` | Pemesanan |
| `/kontak` | Kontak & Lokasi |
| `/admin` | Dashboard Admin *(auth required)* |

---

## QA Checklist (Section 23 PRD)

*(Diupdate setelah setiap fase selesai)*

- [ ] Setiap halaman publik menampilkan konten dari database (bukan hardcoded)
- [ ] Admin dapat login dan route admin tidak bisa diakses tanpa sesi
- [ ] Admin CRUD berfungsi untuk semua entitas
- [ ] Booking tiket saja, gazebo (add-on), dan keduanya menghitung total dengan benar
- [ ] Dua booking simultan untuk gazebo/tanggal yang sama tidak bisa keduanya berhasil
- [ ] Booking Pending yang melewati batas waktu menjadi Expired dan slot dilepas
- [ ] Checkout Snap sandbox berhasil dan booking berubah ke Paid via webhook
- [ ] Pembayaran gagal/dibatalkan tercermin dengan benar di status booking
- [ ] Webhook duplikat tidak merusak state booking/payment
- [ ] Status booking bisa dicek dengan kode referensi + nomor WA
- [ ] Layout responsif di mobile, tablet, dan desktop
- [ ] Focus keyboard terlihat, form menampilkan state sukses/error dengan jelas

---

## Tech Stack

- **Next.js** (App Router) + **TypeScript** (strict)
- **SCSS / SCSS Modules**
- **Prisma ORM** + **MySQL 8**
- **Docker + Docker Compose**
- **Midtrans Snap Sandbox** + QRIS
- **Zod** (validasi)
- **iron-session** (admin auth)
