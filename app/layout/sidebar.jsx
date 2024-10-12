'use client';
import { useSession, signOut } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useState } from "react";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/Login'); 
    }
  }, [status, router]);

  // Show nothing while session status is loading
  if (status === 'loading') {
    return null;
  }

  // Handle logout functionality
  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.clear();
    sessionStorage.clear();
    redirect('/Login');
  };

  // Define Menus array here, based on the session information
  const Menus = [
    { href: "/", title: "Tableu de bord", src: "/sidebaricons/stats.png" },
    { href: "/Commandes", title: "Commandes", src: "/sidebaricons/commands.png" },
    ...(session?.user?.roles.includes("Hardware") || session?.user?.roles.includes("Stock") 
      ? [{ href: "/Materials", title: "Entrés de Stock", src: "/sidebaricons/stock.png", gap: true }] 
      : []
    ),
    { href: "/Products", title: "Materiels", src: "/sidebaricons/materiel.png"  },
    { href: "/Logiciels", title: "Logiciels", src: "/sidebaricons/logiciel.png" },
    { href: "/Pannes", title: "Pannes", src: "/sidebaricons/panne.png" },
    { href: "/Notifications", title: "Notifications", src: "/sidebaricons/notifs.png", gap: true },
    { href: "/Settings", title: "Paramétres", src: "/sidebaricons/settings.png" },
  ];

  if (!session?.user) {
    redirect('/Login');
    return null; // Prevent rendering of the component if no user is logged in
  }

  return (
    <div className="flex">
      <div className={` ${open ? "w-72" : "w-20 "} h-screen p-5 pt-8 relative duration-300 border-r-2 border-r-gray-100 shadow-2xl sticky top-0`}>
        
        {/* Sidebar toggle button */}
        <img
          src="/sidebaricons/arrow.png"
          className={`absolute cursor-pointer -right-4 bg-gray-100 top-9 w-9 border-dark-purple border-2 rounded-full ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        
        {/* Sidebar Header */}
        <div className="flex gap-x-4 items-center">
          <img
            src="/sidebaricons/home.png"
            className={`cursor-pointer w-20 duration-500 ${open && "rotate-[360deg]"}`}
          />
          <h1 className={`text-blue-gray-900 font-comfortaa text-2xl origin-left duration-200 ${!open && "scale-0"}`}>
            Storage Manager
          </h1>
        </div>
        
        {/* Sidebar Menu */}
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-900 text-sm items-center gap-x-4 
                ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"}`}
            >
              <Link className="flex space-x-3" href={Menu.href}>
                <img src={Menu.src} className="w-8" />
                <span className={`${!open && "hidden"} font-cairo text-lg origin-left duration-200`}>
                  {Menu.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
  
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center rounded-md text-sm font-medium disabled:opacity-50 border border-input bg-background shadow-sm hover:text-accent-foreground w-full justify-center h-10 mt-5 hover:bg-gray-300 text-white hover:duration-300"
        >
          <span className={`${!open && "hidden"}mr-4 hover:text-white`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
          </span>
          <p className={`${!open && "hidden"} whitespace-nowrap opacity-100 text-black`}>
            Sign out
          </p>
        </button>
      </div>
    </div>
  );  
}

export default Sidebar;
