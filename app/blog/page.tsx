import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { posts } from "@/lib/site-content";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, shipping tips, and logistics insights from Raf Auto Freight Logistics.",
};

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const items = await posts();

  return (
    <>
      <PageHero
        title="News & Insights"
        subtitle="Shipping tips, route guides, and company updates."
      />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {items.length === 0 ? (
            <p className="text-center text-brand-navy/60">
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm"
                >
                  {post.cover_image_url && (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      width={500}
                      height={300}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-xs text-brand-navy/50">
                      <CalendarDays className="size-3.5" />
                      {formatDate(post.published_at)}
                    </p>
                    <h2 className="mt-2 font-heading text-lg font-bold text-brand-navy">
                      <Link href={`/blog/${post.slug}`} className="hover:text-brand-orange">
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 flex-1 text-sm text-brand-navy/60">
                        {post.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 text-sm font-semibold text-brand-orange hover:underline"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
