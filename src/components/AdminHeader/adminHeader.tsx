"use client";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import Link from "next/link";
import { usePathname } from "next/navigation";

const segmentLabel = (seg: string) => {
  if (!seg) return "";
  const map: Record<string, string> = {
    admin: "Dashboard",
    works: "Works",
  };
  return (
    map[seg] || seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

const AdminHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hpp_admin_user");
      if (stored) setAdminName(stored);
    } catch {}
  }, []);

  const segments = pathname
    .split("?")[0]
    .split("#")[0]
    .split("/")
    .filter(Boolean);
  // Build breadcrumb items (only within /admin context but allow deeper nesting)
  const breadcrumbItems: { href: string; label: string }[] = [];
  let acc = "";
  segments.forEach((seg) => {
    acc += `/${seg}`;
    // Only include after /admin to make sense for dashboard
    if (seg === "admin" || acc.startsWith("/admin/")) {
      breadcrumbItems.push({ href: acc, label: segmentLabel(seg) });
    }
  });

  return (
    <header className="flex flex-col gap-4 py-4 sticky top-0 bg-white border-b border-[#ededed] z-30">
      <Container>
        <div className="flex items-center justify-between gap-6 flex-wrap relative">
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hpp-logo.svg"
                alt="HPP"
                className="h-8 w-auto drop-shadow-sm group-hover:opacity-90 transition"
              />
            </Link>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center text-sm font-medium text-neutral-500 gap-2 flex-wrap"
            >
              {breadcrumbItems.map((item, idx) => {
                const isLast = idx === breadcrumbItems.length - 1;
                return (
                  <React.Fragment key={item.href}>
                    {!isLast ? (
                      <Link
                        href={item.href}
                        className="hover:text-neutral-800 transition"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-neutral-900">{item.label}</span>
                    )}
                    {!isLast && (
                      <span className="text-neutral-300 select-none">/</span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserMenu((o) => !o)}
              className="flex items-center gap-3 px-2 py-1.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 transition cursor-pointer"
            >
              <div className="relative w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-600">
                {adminName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col items-start leading-tight pr-1">
                <span className="text-[11px] uppercase tracking-wide text-neutral-400">
                  Signed in
                </span>
                <span className="text-sm text-neutral-800 font-medium">
                  {adminName}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-neutral-400"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 8l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-neutral-200 bg-white shadow-lg p-3 z-20 animate-fade-in">
                <div className="flex items-center gap-3 mb-3 px-1">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold text-neutral-600">
                    {adminName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-neutral-900">
                      {adminName}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Administrator
                    </span>
                  </div>
                </div>
                <div className="border-t border-neutral-200 my-2" />
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch("/api/auth/logout", {
                      method: "POST",
                      headers: { Accept: "text/html" },
                    });
                    window.location.href = "/admin/login";
                  }}
                >
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default AdminHeader;
