import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Fasilitas",
  description: "Fasilitas penunjang kenyamanan pengunjung di Riam Ensiling.",
};

export default function FasilitasPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Kenyamanan Pengunjung"
        title="Fasilitas Usaha Wisata"
        subtitle="Sarana pendukung seperti area parkir luas, toilet & ruang ganti, mushola bersih, dan warung konsumsi."
        size="lg"
      />
    </div>
  );
}
