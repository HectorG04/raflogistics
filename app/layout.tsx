import type { Metadata } from "next";
import { Montserrat, Poppins, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { StickyContactBar } from "@/components/site/sticky-contact-bar";
import { Toaster } from "@/components/ui/sonner";
import { siteSettings } from "@/lib/site-content";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["700"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://raffreightlogistics.com"
  ),
  title: {
    default: "Raf Auto Freight | Nationwide Auto & Freight Logistics",
    template: "%s | Raf Auto Freight",
  },
  description:
    "Raf Auto Freight Logistics provides professional nationwide auto transport and freight services. Safe, fast, reliable. MC 01762619 · USDOT 4467308.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await siteSettings();

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header settings={settings} />
        <main className="flex-1 pb-14 lg:pb-0">{children}</main>
        <Footer settings={settings} />
        <StickyContactBar settings={settings} />
        <Toaster richColors position="top-center" />
        <Analytics />
      </body>
    </html>
  );
}
