import { getAdminSession } from "@/lib/auth";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import Card from "@/components/ui/Card/Card";
import Button from "@/components/ui/Button/Button";
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
          description="Kelola daftar objek dan daya tarik wisata yang ditampilkan kepada pengunjung."
          footer={
            <Button as="link" href="/admin/atraksi" variant="primary" size="sm">
              Kelola Atraksi
            </Button>
          }
        />
        <Card
          title="Fasilitas"
          description="Kelola sarana dan fasilitas penunjang area wisata."
          footer={
            <Button as="link" href="/admin/fasilitas" variant="primary" size="sm">
              Kelola Fasilitas
            </Button>
          }
        />
        <Card
          title="Galeri Foto"
          description="Kelola dokumentasi foto keindahan alam Riam Ensiling."
          footer={
            <Button as="link" href="/admin/galeri" variant="primary" size="sm">
              Kelola Galeri
            </Button>
          }
        />
        <Card
          title="Tiket & Harga"
          description="Atur jenis tiket masuk dan penetapan harga operasional."
          footer={
            <Button as="link" href="/admin/tiket" variant="primary" size="sm">
              Kelola Tiket
            </Button>
          }
        />
        <Card
          title="Sewa Gazebo"
          description="Kelola ketersediaan gazebo dan tarif sewa per hari."
          footer={
            <Button as="link" href="/admin/gazebo" variant="primary" size="sm">
              Kelola Gazebo
            </Button>
          }
        />
        <Card
          title="Daftar Pemesanan"
          description="Pantau status transaksi pemesanan tiket dan gazebo wisatawan."
          footer={
            <Button as="link" href="/admin/pemesanan" variant="primary" size="sm">
              Kelola Pemesanan
            </Button>
          }
        />
      </div>
    </div>
  );
}
