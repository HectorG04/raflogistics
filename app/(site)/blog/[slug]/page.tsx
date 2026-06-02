import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { postBySlug } from "@/lib/site-content";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await postBySlug((await params).slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.cover_image_url
      ? { images: [{ url: post.cover_image_url }] }
      : undefined,
  };
}

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Params) {
  const post = await postBySlug((await params).slug);
  if (!post) notFound();

  const paragraphs = (post.body ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <article className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to blog
        </Link>

        <h1 className="mt-6 font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-brand-navy/50">
          <CalendarDays className="size-4" />
          {formatDate(post.published_at)}
        </p>

        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            width={900}
            height={500}
            className="mt-8 w-full rounded-xl object-cover"
            priority
          />
        )}

        <div className="mt-8 space-y-5 leading-relaxed text-brand-navy/80">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
