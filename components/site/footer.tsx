import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteSettings } from "@/lib/types";
import { NewsletterForm } from "@/components/site/newsletter-form";

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto bg-brand-navy text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-heading text-xl font-bold text-white">
            Raf Auto Freight
          </h3>
          <p className="mt-4 text-sm leading-relaxed">
            Professional nationwide auto transport and freight logistics.
            Safe, fast, and reliable across the country.
          </p>
          <p className="mt-4 text-xs font-medium text-white/60">
            MC {settings.mc_number} · USDOT {settings.usdot_number}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-orange">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-brand-orange" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-brand-orange" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-orange" />
                {settings.address}
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">Newsletter</h4>
          <p className="mt-4 text-sm">
            Get logistics tips and company updates in your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Raf Auto Freight Logistics. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
