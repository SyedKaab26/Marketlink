import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import ChatbotWidget from '@/components/ChatbotWidget';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MarketLink | Fresh groceries from Pakistan, delivered',
  description: 'A Pakistan-first online grocery store connecting you directly with growers and makers across the country.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
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
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable} ${playfairDisplay.variable}`}>
      <body className="bg-[#F9F6F0] text-[#1D3E2E] antialiased selection:bg-[#E06D3B] selection:text-white">
        {children}
        <ChatbotWidget />
      </body>
    </html>
  );
}


