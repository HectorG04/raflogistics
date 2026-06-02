import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function PanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let email: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch {
    email = null;
  }
  if (!email) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <aside className="flex w-60 shrink-0 flex-col bg-brand-navy p-4">
        <div className="px-3 py-2">
          <p className="font-heading text-lg font-bold text-white">Raf Admin</p>
          <p className="truncate text-xs text-white/50">{email}</p>
        </div>
        <div className="mt-4 flex-1">
          <AdminNav />
        </div>
        <div className="space-y-1 border-t border-white/10 pt-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="size-4" /> View Site
          </Link>
          <SignOutButton />
        </div>
      </aside>
      <div className="flex-1 overflow-x-hidden p-8">{children}</div>
    </div>
  );
}
