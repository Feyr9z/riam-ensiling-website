import { getAdminSession } from "@/lib/auth";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import Card from "@/components/ui/Card/Card";
import styles from "./admin-home.module.scss";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  return (
    <div className={styles.container}>
      <SectionHeader
        eyebrow="Panel Kontrol"
        title="Dashboard Operasional"
        subtitle={`Selamat datang kembali, ${session.email ?? "Admin"}. Kelola konten, tiket, gazebo, dan pemesanan dari sini.`}
        align="left"
      />

      <div className={styles.grid}>
        <Card
          title="Atraksi Wisata"
          description="Kelola daftat objek dan daya tarik wisata yang ditampilkan pada pengunjung."
        />
        <Card
          title="Fasilitas"
          description="Kelola sarana dan fasilitas penunjang area wisata."
        />
        <Card
          title="Galeri Foto"
          description="Kelola dokumentasi foto keindahan alam Riam Ensiling."
        />
        <Card
          title="Tiket & Harga"
          description="Atur jenis tiket masuk dan penetapan harga operasional."
        />
        <Card
          title="Sewa Gazebo"
          description="Kelola ketersediaan gazebo dan tarif sewa per hari."
        />
        <Card
          title="Daftar Pemesanan"
          description="Pantau status transaksi pemesanan tiket dan gazebo wisatawan."
        />
      </div>
    </div>
  );
}
