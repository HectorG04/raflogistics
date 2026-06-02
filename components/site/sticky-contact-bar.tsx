import { Phone, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

/** Fixed bottom bar on mobile: click-to-call + WhatsApp. */
export function StickyContactBar({ settings }: { settings: SiteSettings }) {
  const tel = settings.phone?.replace(/[^\d+]/g, "");
  const wa = settings.whatsapp?.replace(/[^\d]/g, "");

  if (!tel && !wa) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 lg:hidden">
      {tel && (
        <a
          href={`tel:${tel}`}
          className="flex items-center justify-center gap-2 bg-brand-navy py-3.5 text-sm font-semibold text-white"
        >
          <Phone className="size-4" /> Call Now
        </a>
      )}
      {wa && (
        <a
          href={`https://wa.me/${wa}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] py-3.5 text-sm font-semibold text-white"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
      )}
    </div>
  );
}
