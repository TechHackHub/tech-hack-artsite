"use client";

import "./ui/globals.css";
import { inter } from "@/app/ui/fonts";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={`${inter.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
