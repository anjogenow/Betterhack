'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnectors } from '@starknet-react/core';

export default function WalletButton() {
  const { address } = useAccount();
  const { disconnect } = useConnectors();
  const [showLogout, setShowLogout] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [textOpacity, setTextOpacity] = useState(1);
  const [resetTimer, setResetTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!address) return;
    setDisplayText(`${address.slice(0, 6)}...${address.slice(-4)}`);
  }, [address]);

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

  // Handle text change after color transition
  useEffect(() => {
    let textTimer: NodeJS.Timeout;
    if (showLogout) {
      setTextOpacity(0);
      textTimer = setTimeout(() => {
        setDisplayText('Logout');
        setTextOpacity(1);
      }, 150);
    } else {
      setTextOpacity(0);
      textTimer = setTimeout(() => {
        if (address) {
          setDisplayText(`${address.slice(0, 6)}...${address.slice(-4)}`);
          setTextOpacity(1);
        }
      }, 150);
    }
    return () => clearTimeout(textTimer);
  }, [showLogout, address]);

  if (!address) return null;

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
      <span 
        className="transition-opacity duration-150"
        style={{ opacity: textOpacity }}
      >
        {displayText}
      </span>
    </button>
  );
} 