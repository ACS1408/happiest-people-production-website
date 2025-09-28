import React from "react";

const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
      <span>
        {label}
        {required && <sup className="text-red-500 ms-0.5">*</sup>}
      </span>
      {children}
      {hint && (
        <span className="text-[11px] font-normal text-neutral-400">{hint}</span>
      )}
    </label>
  );
};

export default Field;
