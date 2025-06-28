import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Banner } from '@/components/banner';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CopilotProvider } from '@/components/copilot-provider';
import { CopilotSidebar } from '@/components/copilot-sidebar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SDWIS: Drinking Water Watch',
  description: 'Real-time monitoring of water quality and compliance across Georgia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <CopilotProvider>
          <Banner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CopilotProvider>
      </body>
    </html>
  );
}
