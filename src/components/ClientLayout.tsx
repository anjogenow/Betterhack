'use client';

import { Web3Provider } from './Web3Provider';
import Header from './Header';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Web3Provider>
      <Header />
      {children}
    </Web3Provider>
  );
} 