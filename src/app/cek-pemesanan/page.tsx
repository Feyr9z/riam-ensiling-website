import { Suspense } from "react";
import PageHeader from "@/components/layout/PageHeader/PageHeader";
import CekStatusForm from "./CekStatusForm";

export const metadata = {
  title: "Cek Status Pemesanan",
  description: "Cek status pemesanan tiket dan gazebo Riam Ensiling.",
};

export default function CekPemesananPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pancarian Status Transaksi"
        title="Cek Status Pemesanan"
        subtitle="Masukkan kode referensi booking (misal: RE-20260822-DEMO) atau nomor WhatsApp Anda untuk memverifikasi status rincian transaksi."
      />

      <section className="container section">
        <Suspense fallback={<p style={{ textAlign: "center", padding: "3rem" }}>Memuat formulir...</p>}>
          <CekStatusForm />
        </Suspense>
      </section>
    </>
  );
}
