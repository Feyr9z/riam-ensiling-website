import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Pemesanan Tiket & Gazebo",
  description: "Pemesanan tiket masuk dan sewa gazebo Riam Ensiling online.",
};

export default function PemesananPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Form Pemesanan Online"
        title="Pesan Tiket & Gazebo"
        subtitle="Isi tanggal kunjungan, pilih jumlah tiket dan gazebo, serta selesaikan pembayaran secara mudah."
        size="lg"
      />
    </div>
  );
}
