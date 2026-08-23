# Riam Ensiling — Website Informasi Wisata & Pemesanan Tiket / Gazebo

Platform sistem informasi pariwisata dan pemesanan tiket masuk serta gazebo online untuk destinasi wisata Riam Ensiling di Desa Lumut, Kabupaten Sanggau, Kalimantan Barat.

---

## Tech Stack

- Framework: Next.js (App Router) + TypeScript (Strict Mode)
- Styling: SCSS / SCSS Modules dengan Design Tokens kustom (tanpa Tailwind)
- Database & ORM: Prisma ORM + MySQL 8.0
- Pengesahan Admin: HTTP-Only Cookie Session (`iron-session`) + `bcryptjs`
- Gateway Pembayaran: Midtrans Snap Sandbox (QRIS, ShopeePay, GoPay, Virtual Account)
- Validasi Data: Zod Schema
- Kontainerisasi: Docker & Docker Compose (`Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`)

---

## Fitur Utama

### Portal Pengunjung Publik
1. Beranda & Profil Wisata: Informasi objek wisata Riam Ensiling, daftar atraksi unggulan, fasilitas penunjang, dan galeri foto interaktif.
2. Katalog Tiket & Gazebo (`/tiket-gazebo`): Informasi tarif tiket masuk dan daftar gazebo tepi sungai yang dapat disewa per hari.
3. Pemesanan Tanpa Registrasi (Guest Checkout): Wisatawan tidak perlu mendaftar akun — cukup mengisi Nama, Nomor WhatsApp, dan Tanggal Kunjungan.
4. Proteksi Double-Booking Gazebo: Mencegah dua wisatawan menyewa gazebo yang sama pada tanggal kunjungan yang sama melalui transaksi database.
5. Kalkulasi Ulang Harga Server-Side: Harga total dihitung ulang di server dari database untuk mencegah manipulasi data dari browser.
6. Pembayaran Snap Sandbox (Midtrans): Integrasi popup pembayaran digital QRIS dan Virtual Account.
7. Cek Status Booking (`/cek-pemesanan`): Halaman mandiri bagi wisatawan untuk mengecek status pemesanan, melihat e-tiket, dan menyinkronkan status pembayaran secara real-time.

### Panel Kontrol Admin (`/admin`)
1. Keamanan Auth: Login Admin terlindungi cookie HTTP-Only terenkripsi.
2. Dashboard Overview: Ringkasan jumlah data atraksi, fasilitas, tiket, gazebo, dan transaksi pemesanan.
3. Modul Manajemen Konten (CRUD):
   - Kelola Atraksi Wisata (Nama, Deskripsi, Gambar, Urutan, Status Publikasi)
   - Kelola Fasilitas (Nama, Deskripsi, Gambar, Urutan, Status Publikasi)
   - Kelola Galeri Foto (URL Foto dengan fitur Live Image Preview)
   - Kelola Tiket Masuk (Nama, Harga, Deskripsi, Status Aktif)
   - Kelola Sewa Gazebo (Kode Gazebo, Nama, Harga, Kapasitas, Deskripsi, Status Aktif)
4. Manajemen Pemesanan Berbasis Aturan Bisnis:
   - Filter status transaksi (`Pending`, `Paid`, `Completed`, `Cancelled`, `Expired`)
   - Fitur pencarian instan (Live Search) berdasarkan Kode Referensi, Nama, atau WhatsApp
   - Aturan transisi status yang terstruktur serta validasi ketersediaan gazebo saat pengaktifan ulang booking

---

## Panduan Instalasi & Pengembangan Lokal

### Prasyarat
- Node.js v18+ atau v20+
- Docker & Docker Compose (atau MySQL 8.0 lokal)

### 1. Clone Repository & Install Dependensi
```bash
git clone https://github.com/Feyr9z/riam-ensiling-website.git
cd riam-ensiling-website
npm install
```

### 2. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi `ADMIN_SESSION_SECRET` dengan string acak (misal buat via `openssl rand -base64 32`).

---

### Metode A: Pengembangan Hybrid (Aplikasi di Host, Database MySQL via Docker)

1. Jalankan kontainer MySQL:
   ```bash
   docker compose up -d mysql
   ```
2. Pastikan `DATABASE_URL` di `.env` mengarah ke host port 3307:
   ```env
   DATABASE_URL="mysql://root:password@127.0.0.1:3307/riam_ensiling"
   ```
3. Push schema dan jalankan seeding data awal:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
4. Jalankan server dev Next.js:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:3000`.

---

### Metode B: Kontainerisasi Penuh (Seluruh Aplikasi & Database via Docker Compose)

1. Pastikan `DATABASE_URL` di `.env` menggunakan hostname service `mysql`:
   ```env
   DATABASE_URL="mysql://root:password@mysql:3306/riam_ensiling"
   ```
2. Jalankan seluruh layanan kontainer:
   ```bash
   docker compose up -d
   ```
3. Jalankan migrasi dan seeding di dalam kontainer app:
   ```bash
   docker compose exec app npx prisma db push
   docker compose exec app npm run db:seed
   ```
4. Aplikasi dapat diakses di `http://localhost:3000`.

---

## Kredensial Akun Admin Default

- URL Login Admin: `http://localhost:3000/admin/login`
- Email Admin: `admin@riamensiling.id`
- Password Admin: `admin123`

---

## Konfigurasi Midtrans Sandbox

1. Dapatkan Server Key & Client Key dari Midtrans Sandbox Dashboard (Settings -> Access Keys).
2. Perbarui berkas `.env`:
   ```env
   MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxxxx"
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxxxx"
   MIDTRANS_IS_PRODUCTION=false
   ```
3. Penyelaras Status Auto-Sync: Di lingkungan dev lokal, status pembayaran diuji menggunakan Midtrans Payment Simulator. Aplikasi dilengkapi dengan API Auto-Sync yang otomatis menyinkronkan status saat halaman `/cek-pemesanan` dibuka.

---

## Pembersihan Booking Kedaluwarsa (Auto-Expiry Sweep)

Booking yang berstatus `PENDING` memiliki batas waktu `expiresAt` (default: 60 menit / 24 jam).

- Sweeper Otomatis: Sistem secara otomatis mengubah status booking expired menjadi `EXPIRED` dan melepas kembali slot gazebo saat ada pengunjung lain yang mengecek ketersediaan tanggal.
- Endpoint Cron: `/api/cron/expire-bookings` (dapat dipanggil via HTTP GET/POST oleh scheduler external).

---

## Struktur Direktori Utama

```
riam-ensiling-website/
├── prisma/
│   ├── schema.prisma        # Definisi Model Database Prisma
│   └── seed.ts              # Script Seeding Data Awal
├── src/
│   ├── app/                 # Next.js App Router (Pages & API Routes)
│   │   ├── admin/           # Dashboard & Modul CRUD Admin
│   │   ├── api/             # Webhook Midtrans & Cron Expire API
│   │   ├── atraksi/         # Halaman Publik Atraksi Wisata
│   │   ├── cek-pemesanan/   # Halaman Publik Cek Status Booking
│   │   ├── fasilitas/       # Halaman Publik Fasilitas Wisata
│   │   ├── galeri/          # Halaman Publik Galeri Foto
│   │   ├── pemesanan/       # Form Booking Guest & Snap Payment
│   │   ├── tentang/         # Halaman Profil & Kebijakan Wisata
│   │   └── tiket-gazebo/    # Katalog Tarif Tiket & Gazebo
│   ├── components/          # Reusable UI & Layout Components
│   │   ├── admin/           # Komponen Khusus Navigasi & Tabel Admin
│   │   ├── layout/          # Navbar, Footer, PageHeader
│   │   └── ui/              # Button, Card, Modal, StatusBadge, Hero, GalleryGrid
│   ├── lib/                 # Shared Utilities (Prisma, Auth, Midtrans, Expiry)
│   └── styles/              # SCSS Design Tokens, Variables, Mixins, Reset
├── .env.example             # Template Environment Variables
├── docker-compose.yml       # Konfigurasi Docker MySQL & App
├── Dockerfile               # Multi-stage Dockerfile produksi
├── Dockerfile.dev           # Container setup dev
├── next.config.ts           # Konfigurasi Next.js (output: standalone)
├── PRD.md                   # Spesifikasi Utama & Aturan Proyek (Internal)
└── AGENTS.md                # Aturan Kerja Tim Pengembang (Internal)
```

---

## Hak Cipta & Lisensi

Dibuat untuk Pengelola Pariwisata Riam Ensiling, Desa Lumut, Kabupaten Sanggau. Hak Cipta Dilindungi Undang-Undang © 2026.
