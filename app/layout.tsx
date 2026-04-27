import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paisa — Expense Tracker",
  description:
    "A small, honest expense tracker. Record what you spend, see where it goes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased">
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
