import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beta Release Challenge",
  description:
    "Complete the nine tasks, reveal the rewards, and ship the beta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
