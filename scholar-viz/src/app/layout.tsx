import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Computational Neuroscience Scholar Analysis",
  description: "Visual analysis of top scholars in computational neuroscience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
