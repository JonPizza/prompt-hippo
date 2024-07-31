import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import NavBar from "@/components/nav-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LLM Prompt Testing Suite - Prompt Hippo 🦛",
  description: "Prompt Hippo allows you to test LLM prompts side-by-side for robustness, reliability, and safety.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-base-100 min-h-screen"}>
        <div className="sticky top-0 z-[51]">
          <NavBar />
        </div>
        <div className="w-full">
          {children}
        </div>
      </body>
    </html>
  );
}