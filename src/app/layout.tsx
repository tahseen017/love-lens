import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Love Lens - Discover Your Relationship Vibe",
  description: "Upload your chat screenshots and let AI reveal the true energy of your relationship. Get vibe scores, relationship auras, and red flag detection.",
  keywords: ["Love Lens", "Relationship Analysis", "Chat Analysis", "Vibe Score", "AI Relationship", "Love Compatibility"],
  authors: [{ name: "Love Lens Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Love Lens - Discover Your Relationship Vibe",
    description: "Analyze your chat screenshots and get insights about your relationship energy",
    url: "https://lovelens.ai",
    siteName: "Love Lens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Lens - Discover Your Relationship Vibe",
    description: "Analyze your chat screenshots and get insights about your relationship energy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
