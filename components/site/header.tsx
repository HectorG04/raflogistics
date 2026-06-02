"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Header({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const tel = settings.phone ? `tel:${settings.phone.replace(/[^\d+]/g, "")}` : "#";

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="hidden bg-brand-navy text-white/90 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm">
          <div className="flex items-center gap-6">
            <span>{settings.email}</span>
            <span className="inline-flex items-center gap-2">
              <Phone className="size-3.5" /> {settings.phone}
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <span>MC {settings.mc_number}</span>
            <span>USDOT {settings.usdot_number}</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="border-b border-black/5 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center" aria-label="Raf Auto Freight home">
            <Image
              src="/images/raf-logo.jpg"
              alt="Raf Auto Freight"
              width={150}
              height={48}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-brand-navy transition-colors hover:text-brand-orange",
                      active && "text-brand-orange"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Link
              href="/contact#quote"
              className="rounded-md bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              Get A Quote
            </Link>
          </div>

          <button
            type="button"
            className="text-brand-navy lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-7" /> : <Menu className="size-7" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-black/5 bg-white lg:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col px-6 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-sm font-medium text-brand-navy hover:text-brand-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex gap-3">
                <Link
                  href="/contact#quote"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-md bg-brand-orange px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get A Quote
                </Link>
                <a
                  href={tel}
                  className="rounded-md border border-brand-navy px-5 py-2.5 text-center text-sm font-semibold text-brand-navy"
                >
                  Call
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
