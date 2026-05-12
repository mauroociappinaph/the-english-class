import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The English Class | Smart Study Guide",
  description: "A modern, AI-powered English study guide to master expressions, idioms, and grammar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#050505]" suppressHydrationWarning>

        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,20,1)_0%,rgba(5,5,5,1)_100%)] -z-10" />
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
