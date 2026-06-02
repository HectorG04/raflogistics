import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  // Until Supabase is configured, don't gate /admin (avoids breaking local dev).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
