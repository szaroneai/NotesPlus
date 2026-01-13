import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import MainLayout from "@/components/layout/main-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "MyNotes",
  description: "Inteligentny notatnik z asystentem AI",
};

import { DataProvider } from "@/context/data-context";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-background text-foreground`}>
        <QueryProvider>
          <DataProvider>
            <MainLayout>
              {children}
            </MainLayout>
            <Toaster />
          </DataProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
