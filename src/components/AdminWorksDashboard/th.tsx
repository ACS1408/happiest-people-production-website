import React from "react";

const Th = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <th className={"text-left font-semibold py-3 px-3 " + className}>
      {children}
    </th>
  );
};

export default Th;
