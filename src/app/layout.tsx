import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Riam Ensiling",
    template: "%s | Riam Ensiling",
  },
  description:
    "Wisata alam Riam Ensiling — informasi destinasi, tiket, dan pemesanan gazebo di Desa Lumut, Kecamatan Toba, Kabupaten Sanggau.",
  keywords: ["riam ensiling", "wisata sanggau", "wisata kalimantan", "tiket wisata"],
  openGraph: {
    title: "Riam Ensiling",
    description: "Wisata alam Riam Ensiling — informasi, tiket, dan pemesanan gazebo.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
