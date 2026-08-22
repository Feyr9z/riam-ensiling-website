import { getAdminSession } from "@/lib/auth";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import Card from "@/components/ui/Card/Card";
import Button from "@/components/ui/Button/Button";
import styles from "./admin-home.module.scss";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  const modules = [
    {
      title: "Atraksi Wisata",
      description: "Kelola daftar objek dan daya tarik wisata yang ditampilkan kepada pengunjung.",
      href: "/admin/atraksi",
      btnText: "Kelola Atraksi",
    },
    {
      title: "Fasilitas",
      description: "Kelola sarana dan fasilitas penunjang area wisata Riam Ensiling.",
      href: "/admin/fasilitas",
      btnText: "Kelola Fasilitas",
    },
    {
      title: "Galeri Foto",
      description: "Kelola dokumentasi foto keindahan alam Riam Ensiling.",
      href: "/admin/galeri",
      btnText: "Kelola Galeri",
    },
    {
      title: "Tiket & Harga",
      description: "Atur jenis tiket masuk dan penetapan harga operasional.",
      href: "/admin/tiket",
      btnText: "Kelola Tiket",
    },
    {
      title: "Sewa Gazebo",
      description: "Kelola ketersediaan gazebo dan tarif sewa per hari.",
      href: "/admin/gazebo",
      btnText: "Kelola Gazebo",
    },
    {
      title: "Daftar Pemesanan",
      description: "Pantau status transaksi pemesanan tiket dan gazebo wisatawan.",
      href: "/admin/pemesanan",
      btnText: "Kelola Pemesanan",
    },
  ];

  return (
    <div className={styles.container}>
      <SectionHeader
        eyebrow="Panel Kontrol"
        title="Dashboard Operasional"
        subtitle={`Selamat datang kembali, ${session.email ?? "Admin"}. Kelola konten, tiket, gazebo, dan pemesanan dari sini.`}
        align="left"
      />

      <div className={styles.grid}>
        {modules.map((mod) => (
          <Card
            key={mod.href}
            title={mod.title}
            description={mod.description}
            footer={
              <Button as="link" href={mod.href} variant="primary" size="sm">
                {mod.btnText}
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
