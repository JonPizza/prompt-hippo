import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/nav-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JonPizza",
  description: "JonPizza oauth",
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
        <div className="max-w-screen-lg mx-auto p-12">
          {children}
        </div>
      </body>
    </html>
  );
}
