'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount, useConnectors } from '@starknet-react/core';
import { argentConnector } from './Web3Provider';
import CreateEventModal from './CreateEventModal';
import WalletButton from './WalletButton';

interface UserProfile {
  address: string;
  name?: string;
}

export default function Header() {
  const { address } = useAccount();
  const { connect } = useConnectors();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Function to load profile
  const loadProfile = () => {
    if (address) {
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      setProfile(profiles[address] || { address });
    } else {
      setProfile(null);
    }
  };

  // Initial profile load
  useEffect(() => {
    loadProfile();
  }, [address]);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userProfiles') {
        loadProfile();
      }
    };

    // For changes in other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // For changes in the current tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      const event = new StorageEvent('storage', {
        key: key,
        newValue: value,
        oldValue: localStorage.getItem(key),
        storageArea: localStorage
      });
      originalSetItem.apply(this, [key, value]);
      window.dispatchEvent(event);
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [address]);

  const handleCreateEvent = () => {
    if (!address) {
      // If not connected, prompt to connect wallet
      connect(argentConnector);
      return;
    }
    setIsModalOpen(true);
  };

  const handleEventSubmit = (eventData: any) => {
    // Add creator's wallet address to event data
    const eventWithCreator = {
      ...eventData,
      creatorAddress: address,
      createdAt: new Date().toISOString(),
    };

    // Here you would typically send this to your backend/smart contract
    console.log('New event data:', eventWithCreator);
    // For now, we'll just add it to localStorage
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.push(eventWithCreator);
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
            {address && (
              <>
                <button 
                  onClick={handleCreateEvent}
                  className="px-3 py-1.5 text-sm text-secondary hover:text-primary transition-colors"
                >
                  Create Event
                </button>
                <Link
                  href="/profile"
                  className="px-3 py-1.5 text-sm text-secondary hover:text-primary transition-colors"
                >
                  {profile?.name || 'Profile'}
                </Link>
              </>
            )}
            {!address ? (
              <button
                onClick={() => connect(argentConnector)}
                className="px-3 py-1.5 text-sm bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <WalletButton />
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