import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostById } from "@/lib/db/admin-content";
import { savePost } from "@/app/admin/actions";

const input =
  "w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-orange focus:outline-none";

export default async function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const post = isNew ? null : await getPostById(id).catch(() => null);

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to posts
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-bold text-brand-navy">
        {isNew ? "New Post" : "Edit Post"}
      </h1>

      <form action={savePost} className="mt-6 space-y-4 rounded-xl border border-black/5 bg-white p-6 shadow-sm">
        {post && <input type="hidden" name="id" value={post.id} />}

        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Title</label>
          <input name="title" defaultValue={post?.title} required className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">
            Slug (leave blank to auto-generate)
          </label>
          <input name="slug" defaultValue={post?.slug} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">Excerpt</label>
          <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} className={input} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-navy/70">
            Body (plain text / markdown-style paragraphs)
          </label>
          <textarea name="body" defaultValue={post?.body ?? ""} rows={12} className={input} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-navy/70">Cover image</label>
            <input type="file" name="cover" accept="image/*" className="block w-full text-sm text-brand-navy/70 file:mr-3 file:rounded-md file:border-0 file:bg-brand-navy file:px-3 file:py-2 file:text-white" />
            {post?.cover_image_url && (
              <p className="mt-1 truncate text-xs text-brand-navy/50">
                Current: {post.cover_image_url}
              </p>
            )}
            <input type="hidden" name="cover_image_url" value={post?.cover_image_url ?? ""} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-brand-navy/70">Status</label>
            <select name="status" defaultValue={post?.status ?? "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <button className="rounded-md bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white hover:brightness-95">
          Save Post
        </button>
      </form>
    </div>
  );
}
