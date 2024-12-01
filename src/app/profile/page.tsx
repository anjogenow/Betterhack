'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      router.replace(`/profile/${address}`);
    }
  }, [address, router]);

  return <div className="p-4">Loading profile...</div>;
} 