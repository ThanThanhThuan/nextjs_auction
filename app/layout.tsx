import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"; // Ensure the path and case match your file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LiveAuction | Real-Time Bidding",
  description: "Next.js 15 + SQL Server + Pusher Real-time Auction App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        {/* The Navbar is shared across all pages */}
        <Navbar />

        {/* This main tag holds the unique content for each page */}
        <main className="min-h-[calc(100-64px)]">
          {children}
        </main>

        {/* Simple Footer */}
        <footer className="py-10 border-t border-gray-200 mt-20">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>© 2025 LiveAuction System • Powered by PC3\SQLEXPRESS</p>
          </div>
        </footer>
      </body>
    </html>
  );
}