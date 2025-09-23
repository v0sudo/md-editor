import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Markdown Editor",
  description: "A modern markdown editor with live preview and export functionality",
  generator: "Orriss Labs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="ldo.dev" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <div className="container border-t py-6">
            <p className="text-center text-sm text-muted-foreground">
              <Link href="https://orrisslabs.com" target="_blank">
                © {new Date().getFullYear()} Orriss Labs. All rights reserved.
              </Link>
            </p>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
