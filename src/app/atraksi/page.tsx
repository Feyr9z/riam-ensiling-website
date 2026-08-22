import type { Attraction } from "@prisma/client";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader/PageHeader";
import Card from "@/components/ui/Card/Card";
import StatusBadge from "@/components/ui/StatusBadge/StatusBadge";
import Button from "@/components/ui/Button/Button";
import styles from "./atraksi.module.scss";

export const metadata = {
  title: "Atraksi Wisata Riam Ensiling",
  description:
    "Daftar objek wisata, pemandangan air terjun, spot foto, dan daya tarik wisata di Riam Ensiling Desa Lumut.",
};

export default async function AtraksiWisataPage() {
  let attractions: Attraction[] = [];

  try {
    attractions = await prisma.attraction.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    // Database connection fallback
  }

  return (
    <>
      <PageHeader
        eyebrow="Pesona Keindahan Alam"
        title="Atraksi Wisata Riam Ensiling"
        subtitle="Jelajahi berbagai spot daya tarik wisata alam unggulan, dari gemuruh air terjun alami hingga area santai tepi sungai."
      />

      <section className={styles.section}>
        <div className="container">
          {attractions.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Belum Ada Atraksi Wisata Dipublikasikan</h3>
              <p>Pengelola belum menambahkan daftar atraksi wisata. Silakan kembali lagi nanti.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {attractions.map((item) => (
                <Card
                  key={item.id}
                  image={{
                    src: item.imageUrl || "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
                    alt: item.name,
                  }}
                  meta={<StatusBadge status="paid" label="Atraksi Wisata" />}
                  title={item.name}
                  description={item.description}
                />
              ))}
            </div>
          )}

          <div className={styles.ctaBox}>
            <h2>Tertarik Mengunjungi Riam Ensiling?</h2>
            <p>Pesan tiket masuk dan sewa gazebo sejuk di tepi sungai secara online sekarang juga.</p>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Pesan Tiket & Gazebo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
