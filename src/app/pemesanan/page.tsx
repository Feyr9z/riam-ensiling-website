import type { Ticket } from "@prisma/client";
import prisma from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader/PageHeader";
import BookingForm from "./BookingForm";

export const metadata = {
  title: "Pemesanan Tiket & Gazebo Online",
  description:
    "Formulir pemesanan online tiket masuk dan sewa gazebo Riam Ensiling di Desa Lumut.",
};

export default async function PemesananPage() {
  let tickets: Ticket[] = [];

  try {
    tickets = await prisma.ticket.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
  } catch (error) {
    // Fallback if DB connects
  }

  return (
    <>
      <PageHeader
        eyebrow="Reservasi Tiket & Gazebo Online"
        title="Formulir Pemesanan Wisata"
        subtitle="Isi tanggal kunjungan, tentukan jumlah tiket dan pilihan gazebo, lalu ikuti instruksi pembayaran otomatis."
      />

      <section className="container section">
        <BookingForm availableTickets={tickets} />
      </section>
    </>
  );
}
