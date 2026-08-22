import Button from "@/components/ui/Button/Button";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import InfoCard from "@/components/ui/InfoCard/InfoCard";
import Card from "@/components/ui/Card/Card";

export default function HomePage() {
  return (
    <div style={{ padding: "2rem 0" }}>
      {/* Section: Component preview */}
      <div className="container section">
        <SectionHeader
          eyebrow="Dalam Pengembangan"
          title="Riam Ensiling"
          subtitle="Website informasi wisata dan pemesanan tiket/gazebo sedang dalam tahap pembangunan. Halaman lengkap akan tersedia setelah semua fase selesai."
          size="lg"
        />

        {/* Buttons preview */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2.5rem" }}>
          <Button variant="primary">Pesan Sekarang</Button>
          <Button variant="secondary">Lihat Informasi</Button>
          <Button variant="accent">Tiket & Gazebo</Button>
          <Button variant="ghost">Kontak</Button>
        </div>

        {/* Status badges preview */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
          <StatusBadge status="pending" />
          <StatusBadge status="paid" />
          <StatusBadge status="cancelled" />
          <StatusBadge status="expired" />
          <StatusBadge status="completed" />
        </div>

        {/* Cards preview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "3rem" }}>
          <InfoCard
            title="Riam Ensiling"
            description="Destinasi wisata alam yang memukau dengan keindahan sungai, hutan, dan alam terbuka di Kabupaten Sanggau."
            tags={["Alam", "Wisata Air", "Keluarga"]}
          />
          <Card
            title="Informasi Tiket"
            description="Informasi harga tiket masuk dan layanan tersedia akan ditampilkan di sini setelah data dimasukkan oleh admin."
          />
          <InfoCard
            title="Gazebo"
            description="Nikmati pemandangan alam yang indah dari gazebo eksklusif kami yang tersedia untuk disewa."
            tags={["Gazebo", "View Alam"]}
          />
        </div>
      </div>
    </div>
  );
}
