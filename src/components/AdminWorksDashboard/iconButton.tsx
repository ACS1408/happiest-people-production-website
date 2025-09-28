import React from "react";

const IconButton = ({
  label,
  onClick,
  icon,
  variant = "default",
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  variant?: "default" | "danger";
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={
        "inline-flex items-center justify-center rounded-md border text-xs font-medium w-8 h-8 focus:outline-none focus:ring-2 focus:ring-neutral-900/40 transition cursor-pointer " +
        (variant === "danger"
          ? "border-red-300 text-red-600 hover:bg-red-50"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-100")
      }
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default IconButton;
