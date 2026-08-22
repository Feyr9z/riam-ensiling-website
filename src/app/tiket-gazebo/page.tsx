import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";

export const metadata = {
  title: "Tiket & Gazebo",
  description: "Daftar harga tiket masuk dan pilihan sewa gazebo Riam Ensiling.",
};

export default function TiketGazeboPage() {
  return (
    <div className="container section">
      <SectionHeader
        eyebrow="Tarif & Layanan"
        title="Tiket Masuk & Sewa Gazebo"
        subtitle="Informasi harga tiket masuk dan pilihan gazebo sejuk tepi sungai untuk keluarga."
        size="lg"
      />
    </div>
  );
}
