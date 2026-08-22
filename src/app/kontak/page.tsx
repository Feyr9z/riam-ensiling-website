import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Kontak & Lokasi",
  description: "Informasi lokasi, peta, dan kontak pengelola Riam Ensiling.",
};

export default function KontakPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Hubungi Kami"
        title="Kontak & Lokasi Wisata"
        subtitle="Petunjuk jalan menuju Desa Lumut, Kecamatan Toba, Kabupaten Sanggau, Kalimantan Barat."
        size="lg"
      />
    </div>
  );
}
