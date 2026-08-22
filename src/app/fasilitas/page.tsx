import type { Facility } from "@prisma/client";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader/PageHeader";
import Card from "@/components/ui/Card/Card";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import Button from "@/components/ui/Button/Button";
import styles from "./fasilitas.module.scss";

export const metadata = {
  title: "Fasilitas Riam Ensiling",
  description:
    "Daftar sarana dan fasilitas penunjang kenyamanan pengunjung di Riam Ensiling Desa Lumut.",
};

export default async function FasilitasPage() {
  let facilities: Facility[] = [];

  try {
    facilities = await prisma.facility.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    // Database connection fallback
  }

  return (
    <>
      <PageHeader
        eyebrow="Kenyamanan Pengunjung"
        title="Fasilitas Usaha Wisata"
        subtitle="Berbagai sarana prasarana telah disiapkan untuk memberikan kenyamanan dan keamanan terbaik bagi seluruh wisatawan."
      />

      <section className={styles.section}>
        <div className="container">
          {facilities.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Belum Ada Fasilitas Dipublikasikan</h3>
              <p>Pengelola belum menambahkan daftar fasilitas. Silakan kembali lagi nanti.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {facilities.map((item) => (
                <Card
                  key={item.id}
                  image={{
                    src: item.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
                    alt: item.name,
                  }}
                  meta={<StatusBadge status="completed" label="Fasilitas" />}
                  title={item.name}
                  description={item.description}
                />
              ))}
            </div>
          )}

          <div className={styles.ctaBox}>
            <h2>Nikmati Fasilitas Riam Ensiling</h2>
            <p>Pesan tiket masuk dan amankan lokasi sewa gazebo tepi sungai favorit Anda hari ini.</p>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Pesan Tiket & Gazebo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
