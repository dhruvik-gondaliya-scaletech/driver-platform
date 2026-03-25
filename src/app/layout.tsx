import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AppHeader } from "@/components/shared/AppHeader";
import { BottomNav } from "@/components/shared/BottomNav";
import { PageTransition } from "@/components/shared/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charlie Charging - Driver Platform",
  description: "Modern charging station management platform for drivers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background flex flex-col`}
      >
        <Providers>
          <AppHeader />
          <main className="flex-1 pb-20 sm:pb-0 w-full max-w-3xl mx-auto px-4 sm:px-6">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
