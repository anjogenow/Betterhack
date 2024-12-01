'use client';

import { useState } from 'react';
import { useAccount, useConnectors } from '@starknet-react/core';

export default function WalletButton() {
  const { address } = useAccount();
  const { disconnect } = useConnectors();
  const [showLogout, setShowLogout] = useState(false);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (showLogout) {
      disconnect();
      setShowLogout(false);
    } else {
      setShowLogout(true);
      // Clear any existing timer
      if (resetTimer) clearTimeout(resetTimer);
      // Set new timer to hide logout after 3 seconds
      const timer = setTimeout(() => {
        setShowLogout(false);
      }, 3000);
      setResetTimer(timer);
    }
  };

  if (!address) return null;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <button
      onClick={handleClick}
      className={`
        px-3 py-1.5 text-sm rounded-md transition-all duration-300
        ${showLogout 
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
          : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
        }
      `}
    >
      {showLogout ? 'Logout' : shortAddress}
    </button>
  );
} 