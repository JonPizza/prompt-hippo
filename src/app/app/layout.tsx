import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/nav-bar";

import { Toaster } from 'react-hot-toast';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "App - Prompt Hippo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-base-100 min-h-screen"}>
        <NavBar />
        <div className="mx-12">
          {children}
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
