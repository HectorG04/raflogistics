import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { StickyContactBar } from "@/components/site/sticky-contact-bar";
import { siteSettings } from "@/lib/site-content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await siteSettings();
  return (
    <>
      <Header settings={settings} />
      <main className="flex-1 pb-14 lg:pb-0">{children}</main>
      <Footer settings={settings} />
      <StickyContactBar settings={settings} />
    </>
  );
}
