import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Navbar, Footer } from "@/components";
import "@/styles/globals.scss";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "Riam Ensiling — Wisata Alam & Pemesanan Gazebo",
    template: "%s | Riam Ensiling",
  },
  description:
    "Informasi destinasi wisata alam Riam Ensiling, harga tiket masuk, dan pemesanan sewa gazebo secara online di Desa Lumut, Kecamatan Toba, Kabupaten Sanggau.",
  keywords: [
    "riam ensiling",
    "wisata alam sanggau",
    "wisata kalimantan barat",
    "sewa gazebo riam ensiling",
    "tiket masuk riam ensiling",
    "destinasi wisata sanggau",
  ],
  authors: [{ name: "Pengelola Wisata Riam Ensiling" }],
  openGraph: {
    title: "Riam Ensiling — Wisata Alam & Pemesanan Gazebo",
    description:
      "Nikmati keasrian alam Riam Ensiling. Dapatkan informasi tiket dan sewa gazebo online secara mudah.",
    type: "website",
    locale: "id_ID",
    siteName: "Riam Ensiling",
  },
  twitter: {
    card: "summary_large_image",
    title: "Riam Ensiling — Wisata Alam Sanggau",
    description:
      "Wisata alam Riam Ensiling — Informasi destinasi, tiket, dan pemesanan gazebo online.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Lompat ke konten utama
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
