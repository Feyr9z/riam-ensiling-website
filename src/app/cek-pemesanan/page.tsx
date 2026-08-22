import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Cek Status Pemesanan",
  description: "Cek status pemesanan tiket dan gazebo Riam Ensiling.",
};

export default function CekPemesananPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Pencarian Transaksi"
        title="Cek Status Pemesanan"
        subtitle="Masukkan kode referensi booking dan nomor WhatsApp untuk memverifikasi status tiket Anda."
        size="lg"
      />
    </div>
  );
}
