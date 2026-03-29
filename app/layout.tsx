import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worky — Coach Personal Branding",
  description:
    "Coach AI di Workengo per scoprire la tua identità digitale professionale",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-[var(--color-bg)] text-[var(--color-heading)] antialiased">
        {children}
      </body>
    </html>
  );
}
