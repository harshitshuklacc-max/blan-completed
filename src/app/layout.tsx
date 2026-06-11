import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "SHOE MAFIA — Premium Luxury Footwear",
    template: "%s | SHOE MAFIA",
  },
  description:
    "Premium luxury footwear store in Bilaspur, Chhattisgarh. Shop the finest collection of shoes for men, women, and kids.",
  keywords: ["shoes", "footwear", "luxury shoes", "Bilaspur", "SHOE MAFIA"],
  authors: [{ name: "SHOE MAFIA" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://shoemafia.com",
    siteName: "SHOE MAFIA",
    title: "SHOE MAFIA — Premium Luxury Footwear",
    description: "Premium luxury footwear store in Bilaspur, Chhattisgarh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHOE MAFIA — Premium Luxury Footwear",
    description: "Premium luxury footwear store in Bilaspur, Chhattisgarh.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
