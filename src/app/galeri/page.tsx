import type { GalleryItem as PrismaGalleryItem } from "@prisma/client";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader/PageHeader";
import Button from "@/components/ui/Button/Button";
import GalleryViewer from "./GalleryViewer";
import styles from "./galeri.module.scss";

export const metadata = {
  title: "Galeri Foto Riam Ensiling",
  description:
    "Koleksi galeri foto keindahan alam, gemuruh air terjun, dan suasana riam sungai di Desa Lumut, Kabupaten Sanggau.",
};

export default async function GaleriPage() {
  let items: PrismaGalleryItem[] = [];

  try {
    items = await prisma.galleryItem.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    // Database fallback
  }

  return (
    <>
      <PageHeader
        eyebrow="Dokumentasi Visual"
        title="Galeri Foto Riam Ensiling"
        subtitle="Nikmati potret keasrian alam, jernihnya air sungai, dan keceriaan suasana wisatawan di Riam Ensiling."
      />

      <section className={styles.section}>
        <div className="container">
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>Belum Ada Foto Galeri</h3>
              <p>Pengelola belum menambahkan koleksi foto ke dalam galeri. Silakan kembali lagi nanti.</p>
            </div>
          ) : (
            <GalleryViewer
              items={items.map((item) => ({
                id: item.id,
                imageUrl: item.imageUrl,
              }))}
            />
          )}

          <div className={styles.ctaBox}>
            <h2>Ingin Memadikan Momen Anda Sendiri?</h2>
            <p>Kunjungi Riam Ensiling dan amankan tiket masuk serta gazebo sejuk Anda secara online.</p>
            <Button as="link" href="/pemesanan" variant="accent" size="lg">
              Pesan Tiket & Gazebo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
