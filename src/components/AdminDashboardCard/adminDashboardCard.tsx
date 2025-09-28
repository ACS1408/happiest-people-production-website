import Icons from "@/utils/icons";
import Link from "next/link";
import React from "react";

const AdminDashboardCard = ({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) => {
  return (
    <div className="group relative rounded-2xl border border-neutral-200 hover:border-neutral-300 focus-within:outline-2 focus-within:outline-emerald-500 hover:shadow-sm p-6 bg-neutral-50/40 hover:bg-neutral-50 transition">
      {/* Invisible full-card link for stretched clickable area */}
      <Link
        href={href}
        aria-label={`Open ${label} dashboard`}
        className="absolute inset-0 z-0"
        tabIndex={0}
      />
      <div className="relative z-10 flex flex-col gap-3 pointer-events-none group-hover:text-neutral-900">
        <h2 className="ff-figtree text-xl font-medium text-neutral-800 group-hover:text-neutral-900 pointer-events-none">
          {label}
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed pointer-events-none">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-700 group-hover:text-neutral-900 pointer-events-none">
          {label} dashboard
          <Icons.ArrowRight className="h-3 pt-px transition-transform group-hover:translate-x-0.5 [&>path]:stroke-black" />
        </span>
      </div>
    </div>
  );
};

export default AdminDashboardCard;
