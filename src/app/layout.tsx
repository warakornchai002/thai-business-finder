import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saffron & Leaf | Premium Thai Dining",
  description:
    "A premium dark-green Thai food landing page for refined seasonal dining, tasting menus, and private reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
