import type { Metadata } from 'next';
import './globals.css';
import ChatbotWidget from '@/components/ChatbotWidget';

export const metadata: Metadata = {
  title: 'MarketLink | Fresh groceries from Pakistan, delivered',
  description: 'A Pakistan-first online grocery store connecting you directly with growers and makers across the country.',
  openGraph: {
    title: 'MarketLink | Fresh groceries from Pakistan, delivered',
    description: 'Shop fresh groceries from independent farms and producers across Pakistan, delivered to your door.',
    url: 'https://www.marketlink.pk/',
    siteName: 'MarketLink',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#F9F6F0] text-[#1D3E2E] antialiased selection:bg-[#E06D3B] selection:text-white">
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}

