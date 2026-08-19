import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { ThemeScript } from "@/components/layout/ThemeScript";

export const metadata: Metadata = {
  title: {
    default: "3D Bharat · Investment Platform",
    template: "%s · 3D Bharat",
  },
  description:
    "3D Bharat is a production-style fintech investment dashboard with deal discovery, personalised recommendations, portfolio tracking and corporate analytics — powered entirely by simulated frontend data.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
