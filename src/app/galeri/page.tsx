import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Galeri",
  description: "Koleksi foto panorama dan momen indah di Riam Ensiling.",
};

export default function GaleriPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Dokumentasi Visual"
        title="Galeri Keindahan Riam Ensiling"
        subtitle="Potret suasana sungai, pemandangan pepohonan rindang, dan aktivitas wisatawan."
        size="lg"
      />
    </div>
  );
}
