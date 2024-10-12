// app/layout.js
'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import ClientLayout from './ClientLayout';
import { SessionProvider } from "next-auth/react";


const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children , session}) {
  return (
    <SessionProvider session={session}>
    <html lang="en" className="bg-white text-black">

      <body className={inter.className} >
        
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
    </SessionProvider>
  );
}
