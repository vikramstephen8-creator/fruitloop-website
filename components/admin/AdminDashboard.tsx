"use client";

import { useRef, useState } from "react";
import { CATEGORIES } from "@/lib/categories";

type AdminWorkItem = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string | null;
  poster_path: string;
  video_path: string | null;
  case_study_url: string | null;
  tags: string[];
  featured: boolean;
  sort_order: number;
  published_at: string | null;
};

const emptyMsg = { error: "", ok: "" };

export default function AdminDashboard({
  initialItems,
}: {
  initialItems: AdminWorkItem[] | null;
}) {
  const [items, setItems] = useState<AdminWorkItem[] | null>(initialItems);
  const [msgs, setMsgs] = useState<Record<string, { error?: string; ok?: string }>>({});
  const newRef = useRef<HTMLDetailsElement>(null);

  function setMsg(id: string, next: Partial<typeof emptyMsg>) {
    setMsgs((m) => ({ ...m, [id]: next }));
  }

  async function refetch() {
    const res = await fetch("/api/admin/work");
    if (res.ok) {
      const json = (await res.json()) as { items: AdminWorkItem[] };
      setItems(json.items);
    }
  }

  async function save(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const res = await fetch(`/api/admin/work/${id}`, {
      method: "PATCH",
      body: new FormData(e.currentTarget),
    });
    const json = await res.json();
    if (!res.ok) setMsg(id, { error: json.error ?? "Save failed" });
    else {
      setMsg(id, { ok: "Saved ✓ site revalidates shortly" });
      await refetch();
    }
  }

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const res = await fetch("/api/admin/work", {
      method: "POST",
      body: new FormData(form),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg("new", { error: json.error ?? "Create failed" });
      return;
    }
    form.reset();
    setMsg("new", { ok: `Created "${json.item.title}" ✓` });
    if (newRef.current) newRef.current.open = false;
    await refetch();
  }

  async function upload(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });
    const json = await res.json();
    if (!res.ok) setMsg(id, { error: json.error ?? "Upload failed" });
    else setMsg(id, { ok: `Poster replaced (${json.path}) ✓` });
  }

  async function remove(item: AdminWorkItem) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/work/${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      setMsg(item.id, { error: json.error ?? "Delete failed" });
      return;
    }
    await refetch();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <section className="admin">
      <div className="admin-inner">
        <div className="admin-head">
          <h1 className="admin-title">Campaign admin</h1>
          <button className="admin-btn admin-btn--ghost" onClick={logout}>
            Log out
          </button>
        </div>

        {items === null && (
          <p className="admin-msg admin-msg--error">
            Couldn&apos;t load items. Is Supabase reachable?
          </p>
        )}

        <details ref={newRef} className="admin-card admin-card--new">
          <summary>+ New campaign</summary>
          <form onSubmit={create}>
            <ItemFields />
            {msgs["new"]?.error && (
              <p className="admin-msg admin-msg--error">{msgs["new"].error}</p>
            )}
            {msgs["new"]?.ok && <p className="admin-msg">{msgs["new"].ok}</p>}
            <button className="admin-btn">Create</button>
          </form>
        </details>

        {items?.map((item) => (
          <details key={item.id} className="admin-card">
            <summary>
              <span className="admin-item-title">{item.title}</span>
              <span className="admin-item-badges">
                <span className="admin-chip">{item.category}</span>
                {!item.published_at && <span className="admin-chip admin-chip--draft">draft</span>}
                {item.featured && <span className="admin-chip admin-chip--featured">★</span>}
              </span>
            </summary>

            <form onSubmit={(e) => save(e, item.id)}>
              <ItemFields item={item} />
              {msgs[item.id]?.error && (
                <p className="admin-msg admin-msg--error">{msgs[item.id].error}</p>
              )}
              {msgs[item.id]?.ok && <p className="admin-msg">{msgs[item.id].ok}</p>}
              <button className="admin-btn">Save changes</button>
            </form>

            <div className="admin-row">
              <form onSubmit={(e) => upload(e, item.id)}>
                <input type="hidden" name="id" value={item.id} />
                <input
                  className="admin-file"
                  type="file"
                  name="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  required
                />
                <button className="admin-btn admin-btn--ghost">Replace poster</button>
              </form>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => remove(item)}
              >
                Delete
              </button>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function ItemFields({ item }: { item?: AdminWorkItem }) {
  return (
    <>
      <label className="admin-label">Title</label>
      <input className="admin-input" name="title" defaultValue={item?.title} required />

      <label className="admin-label">Slug</label>
      <input
        className="admin-input"
        name="slug"
        defaultValue={item?.slug}
        pattern="[a-z0-9]+(-[a-z0-9]+)*"
        required
      />

      <label className="admin-label">Category</label>
      <select className="admin-input" name="category" defaultValue={item?.category}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="admin-label">Description</label>
      <textarea className="admin-input admin-textarea" name="description" defaultValue={item?.description ?? ""} />

      <label className="admin-label">Poster path (in `work` bucket)</label>
      <input className="admin-input" name="poster_path" defaultValue={item?.poster_path} required />

      <label className="admin-label">Video path (optional)</label>
      <input className="admin-input" name="video_path" defaultValue={item?.video_path ?? ""} />

      <label className="admin-label">Case study URL (optional)</label>
      <input className="admin-input" name="case_study_url" type="url" defaultValue={item?.case_study_url ?? ""} />

      <label className="admin-label">Tags (comma-separated)</label>
      <input className="admin-input" name="tags" defaultValue={item?.tags.join(", ")} />

      <label className="admin-label">Sort order</label>
      <input className="admin-input" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} />

      <div className="admin-checks">
        <label>
          <input type="checkbox" name="published" defaultChecked={!!item?.published_at || !item} />
          Published
        </label>
        <label>
          <input type="checkbox" name="featured" defaultChecked={!!item?.featured} />
          Featured
        </label>
      </div>
    </>
  );
}
