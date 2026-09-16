import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SpendWise AI | Campus Financial Command",
  description: "Next-gen student finance tracker & Gemini-powered advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300 min-h-screen relative`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.06),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.04),transparent_50%)]" />
        
        {/* SVG Dot Matrix Pattern Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />

        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}