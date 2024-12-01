'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  address: string;
  name?: string;
}

interface UserLinkProps {
  address: string;
  showBoth?: boolean;
}

export default function UserLink({ address, showBoth = false }: UserLinkProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    setProfile(profiles[address] || { address });
  }, [address]);

  if (!profile) return null;

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const displayText = showBoth && profile.name 
    ? `${profile.name} (${shortAddress})`
    : profile.name || shortAddress;

  return (
    <Link 
      href={`/profile/${address}`}
      className="hover:text-blue-400 transition-colors"
    >
      {displayText}
    </Link>
  );
} 