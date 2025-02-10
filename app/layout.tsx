"use client";

import "./ui/globals.css";
import { inter } from "@/app/ui/fonts";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <body className={`${inter.className} antialiased`}>
            {children}
            <Toaster />
          </body>
        </QueryClientProvider>
      </SessionProvider>
    </html>
  );
}
