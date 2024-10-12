// app/ClientLayout.js
"use client";

import { useEffect, useState } from "react";
import Sidebar from "./layout/sidebar";
import Subheader from "./layout/header";

export default function ClientLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSubheader, setShowSubheader] = useState(true);

  useEffect(() => {
    const href = window.location.href;
    if (href.includes('/Login')) {
      setShowSidebar(false);
      setShowSubheader(false);
    }
  }, []);

  return (
    <div className="flex bg-white min-h-screen">
      {showSidebar && <Sidebar />}
      <div className="flex flex-col flex-grow">
        {showSubheader && <Subheader />}
        <div className="flex-grow bg-gray-200 border-2 border-gray-200 shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
}
