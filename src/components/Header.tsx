'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount, useConnectors } from '@starknet-react/core';
import { argentConnector } from './Web3Provider';
import CreateEventModal from './CreateEventModal';

export default function Header() {
  const { address } = useAccount();
  const { connect, disconnect } = useConnectors();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateEvent = () => {
    if (!address) {
      // If not connected, prompt to connect wallet
      connect(argentConnector);
      return;
    }
    setIsModalOpen(true);
  };

  const handleEventSubmit = (eventData: any) => {
    // Here you would typically send this to your backend/smart contract
    console.log('New event data:', eventData);
    // For now, we'll just add it to localStorage
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
    // Force a page refresh to show the new event
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center h-full py-1.5">
            <div className="relative w-20 h-full">
              <Image
                src="/betterhack-logo.png"
                alt="BetterHack"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCreateEvent}
              className="px-3 py-1.5 text-sm text-secondary hover:text-primary transition-colors"
            >
              Create Event
            </button>
            {!address ? (
              <button
                onClick={() => connect(argentConnector)}
                className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <button
                onClick={() => disconnect()}
                className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all"
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </button>
            )}
          </div>
        </div>
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEventSubmit}
      />
    </header>
  );
} 