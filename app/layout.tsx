import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Design Review - Intelligent Figma Analysis",
  description: "AI-powered design review platform that integrates Claude Opus 4 with Figma for intelligent design analysis and automated improvements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {children}
      </body>
    </html>
  );
}
