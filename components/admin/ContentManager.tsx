"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldSpec } from "@/lib/admin-content";

type Row = Record<string, unknown> & { id: string | number };

function fieldDefault(spec: FieldSpec, row?: Row): string | boolean {
  const v = row?.[spec.name];
  if (spec.type === "bool") return Boolean(v);
  if (spec.type === "int") return v === undefined || v === null ? "0" : String(v);
  if (v === undefined || v === null) return "";
  if (spec.type === "tags" && Array.isArray(v)) return v.join(", ");
  if (spec.type === "phones" && Array.isArray(v)) {
    return v
      .map((p) => {
        const rec = p as { label?: string; value?: string; href?: string };
        return [rec.label, rec.value, rec.href].filter(Boolean).join(" | ");
      })
      .join("\n");
  }
  return String(v);
}

export default function ContentManager({
  table,
  title,
  fields,
  singleton = false,
}: {
  table: string;
  title: string;
  fields: FieldSpec[];
  singleton?: boolean;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [msgs, setMsgs] = useState<Record<string, string>>({});
  const newRef = useRef<HTMLDetailsElement>(null);

  async function load() {
    const res = await fetch(`/api/admin/content/${table}`);
    if (!res.ok) return setMsgs({ _load: "Failed to load rows" });
    const json = await res.json();
    setRows(json.row ? [json.row as Row] : ((json.rows ?? []) as Row[]));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function say(key: string, msg: string) {
    setMsgs((m) => ({ ...m, [key]: msg }));
  }

  async function save(e: React.FormEvent<HTMLFormElement>, id?: string | number) {
    e.preventDefault();
    const res = await fetch(
      singleton ? `/api/admin/content/${table}/1` : id
        ? `/api/admin/content/${table}/${id}`
        : `/api/admin/content/${table}`,
      {
        method: id || singleton ? "PATCH" : "POST",
        body: new FormData(e.currentTarget),
      },
    );
    const json = await res.json();
    if (!res.ok) return say(String(id ?? "new"), `❌ ${json.error ?? "Save failed"}`);
    say(String(id ?? "new"), "Saved ✓ homepage revalidates shortly");
    if (!id && !singleton) {
      e.currentTarget.reset();
      if (newRef.current) newRef.current.open = false;
    }
    await load();
  }

  async function remove(row: Row) {
    if (!confirm(`Delete this ${title.toLowerCase()} entry? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/content/${table}/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      return say(String(row.id), `❌ ${json.error ?? "Delete failed"}`);
    }
    await load();
  }

  async function replaceFile(field: FieldSpec, row: Row) {
    const input = document.getElementById(
      `file-${row.id}-${field.name}`,
    ) as HTMLInputElement | null;
    const file = input?.files?.[0];
    const pathInput = document.getElementById(
      `field-${row.id}-${field.name}`,
    ) as HTMLInputElement | null;
    const fallbackPath = String(row[field.name] ?? "");
    const path = pathInput?.value?.trim() || fallbackPath;

    if (!file) return say(`${row.id}-${field.name}`, "Pick a file first");
    if (!path) return say(`${row.id}-${field.name}`, "Fill the path field first");

    const fd = new FormData();
    fd.set("bucket", field.uploadBucket!);
    fd.set("path", path);
    fd.set("file", file);

    const res = await fetch("/api/admin/upload-photo", { method: "POST", body: fd });
    const json = await res.json();
    say(
      `${row.id}-${field.name}`,
      res.ok ? `Uploaded ${json.path} ✓` : `❌ ${json.error ?? "Upload failed"}`,
    );
    if (input) input.value = "";
  }

  return (
    <>
      <h2 className="admin-title">{title}</h2>

      {rows === null && !msgs._load && <p className="admin-msg">Loading…</p>}
      {msgs._load && <p className="admin-msg admin-msg--error">{msgs._load}</p>}

      {!singleton && (
        <details ref={newRef} className="admin-card admin-card--new">
          <summary>+ New entry</summary>
          <form onSubmit={(e) => save(e)}>
            {fields.map((f) => renderField(f))}
            {msgs["new"] && <p className="admin-msg">{msgs["new"]}</p>}
            <button className="admin-btn">Create</button>
          </form>
        </details>
      )}

      {rows?.map((row) => (
        <details key={String(row.id)} className="admin-card" open={singleton}>
          {!singleton && (
            <summary>
              <span className="admin-item-title">
                {String(row[fields[0].name] ?? row.id)}
              </span>
              <span className="admin-item-badges">
                {fields
                  .filter((f) => f.type === "bool")
                  .map((f) =>
                    row[f.name] ? (
                      <span key={f.name} className="admin-chip">
                        {f.label}
                      </span>
                    ) : null,
                  )}
              </span>
            </summary>
          )}

          <form onSubmit={(e) => save(e, singleton ? undefined : row.id)}>
            {fields.map((f) => renderField(f, row))}
            {msgs[String(row.id)] && (
              <p className="admin-msg">{msgs[String(row.id)]}</p>
            )}
            <button className="admin-btn">Save changes</button>
          </form>

          {/* File replacement controls for storage-backed fields */}
          {fields.some((f) => f.uploadBucket) && (
            <div className="admin-row">
              {fields
                .filter((f) => f.uploadBucket)
                .map((f) => (
                  <span key={f.name} className="admin-row">
                    <input
                      type="file"
                      className="admin-file"
                      id={`file-${row.id}-${f.name}`}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      onClick={() => replaceFile(f, row)}
                    >
                      Replace {f.label.split(" ")[0].toLowerCase()}
                    </button>
                    {msgs[`${row.id}-${f.name}`] && (
                      <span className="admin-msg">{msgs[`${row.id}-${f.name}`]}</span>
                    )}
                  </span>
                ))}
            </div>
          )}

          {!singleton && (
            <div className="admin-row">
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={() => remove(row)}
              >
                Delete
              </button>
            </div>
          )}
        </details>
      ))}
    </>
  );
}

function renderField(f: FieldSpec, row?: Row) {
  const def = fieldDefault(f, row);
  const common = {
    name: f.name,
    id: row ? `field-${row.id}-${f.name}` : `field-new-${f.name}`,
    required: f.required,
  };

  return (
    <div key={f.name}>
      <label className="admin-label" htmlFor={common.id}>
        {f.label}
        {f.required ? " *" : ""}
      </label>

      {f.type === "textarea" || f.type === "phones" ? (
        <textarea className="admin-input admin-textarea" {...common} defaultValue={String(def)} />
      ) : f.type === "bool" ? (
        <label className="admin-check">
          <input type="checkbox" name={f.name} defaultChecked={Boolean(def)} /> {f.label}
        </label>
      ) : f.type === "int" ? (
        <input className="admin-input" type="number" {...common} defaultValue={String(def)} />
      ) : (
        <input className="admin-input" type="text" {...common} defaultValue={String(def)} />
      )}
    </div>
  );
}
