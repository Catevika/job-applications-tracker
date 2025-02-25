import React from "react";

export default function DeleteLayout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start md:items-center">
      {children}
    </div>
  );
};
