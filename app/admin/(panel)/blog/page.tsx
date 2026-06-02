import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { listAllPosts } from "@/lib/db/admin-content";
import { deletePostAction } from "@/app/admin/actions";

export default async function AdminBlogPage() {
  const posts = await listAllPosts().catch(() => []);
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Blog</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:brightness-95"
        >
          <Plus className="size-4" /> New Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-brand-navy/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-brand-navy">{p.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.status === "published"
                        ? "rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700"
                        : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700"
                    }
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-brand-navy/50">{p.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-black/10 px-2.5 py-1 text-xs font-medium text-brand-navy hover:bg-neutral-50"
                    >
                      <Pencil className="size-3" /> Edit
                    </Link>
                    <form action={deletePostAction.bind(null, p.id)}>
                      <button className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                        <Trash2 className="size-3" /> Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-brand-navy/50">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
