import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.scss";

// ---- Google Fonts via next/font (zero CLS, self-hosted) ----
// Sets CSS variables --font-heading and --font-body on <html>

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

// ---- SEO Metadata ----

export const metadata: Metadata = {
  title: {
    default: "Riam Ensiling",
    template: "%s | Riam Ensiling",
  },
  description:
    "Wisata alam Riam Ensiling — informasi destinasi, tiket, dan pemesanan gazebo di Desa Lumut, Kecamatan Toba, Kabupaten Sanggau.",
  keywords: [
    "riam ensiling",
    "wisata sanggau",
    "wisata kalimantan barat",
    "wisata alam",
    "tiket masuk",
    "pemesanan gazebo",
  ],
  openGraph: {
    title: "Riam Ensiling",
    description:
      "Wisata alam Riam Ensiling — informasi, tiket, dan pemesanan gazebo.",
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ---- Root Layout ----

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
      <body>{children}</body>
    </html>
  );
}
