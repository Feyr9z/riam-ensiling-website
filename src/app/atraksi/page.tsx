import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Atraksi Wisata",
  description: "Daftar objek dan daya tarik wisata alam di Riam Ensiling.",
};

export default function AtraksiWisataPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Keindahan Alam"
        title="Atraksi Wisata Riam Ensiling"
        subtitle="Nikmati berbagai spot swafoto, aliran sungai jernih, dan area santai alam terbuka."
        size="lg"
      />
    </div>
  );
}
