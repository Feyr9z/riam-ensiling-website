import PageHeader from "@/components/layout/PageHeader/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader/SectionHeader";
import Button from "@/components/ui/Button/Button";

export const metadata = {
  title: "Kontak & Lokasi",
  description: "Informasi lokasi, peta, dan kontak pengelola Riam Ensiling.",
};

export default function KontakPage() {
  return (
    <>
      <PageHeader
        eyebrow="Hubungi Kami"
        title="Kontak & Lokasi Wisata"
        subtitle="Petunjuk jalan menuju kawasan objek wisata Riam Ensiling di Desa Lumut, Kecamatan Toba, Kabupaten Sanggau."
      />

      <section className="container section">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", alignItems: "center" }}>
          <div>
            <SectionHeader
              eyebrow="Informasi Lengkap"
              title="Akses & Kontak Pengelola"
              subtitle="Silakan hubungi tim pengelola atau kunjungi lokasi wisata kami di hari operasional."
            />

            <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <li style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#e6fffa", color: "#2c7a64", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <strong style={{ display: "block", color: "#1a202c" }}>Alamat Lengkap</strong>
                  <span style={{ color: "#4a5568", fontSize: "0.875rem" }}>Desa Lumut, Kecamatan Toba, Kabupaten Sanggau, Kalimantan Barat</span>
                </div>
              </li>

              <li style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#e6fffa", color: "#2c7a64", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <strong style={{ display: "block", color: "#1a202c" }}>Jam Operasional</strong>
                  <span style={{ color: "#4a5568", fontSize: "0.875rem" }}>Senin — Minggu: 08.00 - 17.00 WIB</span>
                </div>
              </li>

              <li style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#e6fffa", color: "#2c7a64", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <strong style={{ display: "block", color: "#1a202c" }}>WhatsApp / Telepon</strong>
                  <span style={{ color: "#4a5568", fontSize: "0.875rem" }}>0812-3456-7890 (Pengelola Wisata)</span>
                </div>
              </li>
            </ul>
          </div>

          <div style={{ background: "#f7fafc", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid #e2e8f0", textAlign: "center" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1a202c", marginBottom: "0.5rem" }}>Peta & Petunjuk Arah</h3>
            <p style={{ color: "#4a5568", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Lokasi dapat dijangkau dengan rute darat menggunakan kendaraan roda dua maupun roda empat dari pusat Kabupaten Sanggau.
            </p>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Pesan Tiket & Gazebo Sekarang
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
