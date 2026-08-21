"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      setError("Wrong password. No fruit loops for you.");
      setBusy(false);
    }
  }

  return (
    <section className="admin">
      <div className="admin-inner admin-login">
        <h1 className="admin-title">Fruitloop Admin</h1>
        <p className="admin-sub">Squeeze in. Staff only.</p>
        <form onSubmit={submit} className="admin-card">
          <label className="admin-label" htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
          {error && <p className="admin-msg admin-msg--error">{error}</p>}
          <button className="admin-btn" disabled={busy}>
            {busy ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    </section>
  );
}
