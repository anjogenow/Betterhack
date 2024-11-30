import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import { Web3Provider } from '../components/Web3Provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BetterHack',
  description: 'Hackathon platform with betting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <Web3Provider>
          <Header />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
} 