import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Tentang",
  description: "Profil destinasi wisata alam Riam Ensiling di Kabupaten Sanggau.",
};

export default function TentangPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Profil Destinasi"
        title="Tentang Riam Ensiling"
        subtitle="Mengenal lebih dekat keasrian alam, sungai jernih, dan ketenangan lokasi wisata Riam Ensiling di Desa Lumut, Kecamatan Toba, Kabupaten Sanggau."
        size="lg"
      />
    </div>
  );
}
