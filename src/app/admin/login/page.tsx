"use client";
import React, { useState } from "react";
import Container from "@/components/Container";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { twc } from "@/utils";
import GlobalContextProvider from "@/components/GlobalContextProvider";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      try {
        localStorage.setItem("hpp_admin_user", username);
      } catch {}
      toast.success("Login successful");
      router.replace("/admin/works");
    } catch (e: any) {
      console.log(e.message);
      toast.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalContextProvider contextType="admin">
      <section className={twClasses.section}>
        <Container>
          <div className={twClasses.inner_container}>
            <h1 className={twClasses.title}>
              Admin <em className="not-italic font-medium">Login</em>
            </h1>
            <p className={twClasses.description}>
              Enter credentials to manage works.
            </p>
            <form onSubmit={submit} className={twClasses.form}>
              <label className={twClasses.label}>
                <span>Username</span>
                <input
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={twClasses.input}
                />
              </label>
              <label className={twClasses.label}>
                <span>Password</span>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={twClasses.input}
                />
              </label>
              <button
                disabled={loading}
                type="submit"
                className={twClasses.button}
              >
                {loading ? "Signing in…" : "Login"}
              </button>
            </form>
          </div>
        </Container>
      </section>
    </GlobalContextProvider>
  );
}

const twClasses = twc({
  section: "min-h-screen flex items-center justify-center bg-white py-20",
  inner_container:
    "max-w-sm mx-auto border border-neutral-200 rounded-2xl p-8 bg-neutral-50/50 shadow-sm",
  title: "ff-figtree text-2xl font-light mb-1",
  description: "text-sm text-neutral-500 mb-6",
  label: "flex flex-col gap-1 text-sm font-medium text-neutral-700",
  input:
    "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/30 focus:border-neutral-900 transition",
  button:
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 disabled:opacity-60",
  form: "flex flex-col gap-5",
});
