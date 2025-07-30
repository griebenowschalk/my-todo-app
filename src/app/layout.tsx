import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Todo App',
  description: 'A modern, full-stack todo application built with Next.js 15',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen grid grid-rows-[auto_1fr_auto]">
        {children}
      </body>
    </html>
  );
}
