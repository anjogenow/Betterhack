'use client';
import { StarknetConfig, InjectedConnector } from '@starknet-react/core';
import { SequencerProvider } from 'starknet';

export const argentConnector = new InjectedConnector({ options: { id: 'argentX' }});

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const provider = new SequencerProvider({ 
    baseUrl: 'https://alpha4.starknet.io'
  });

  return (
    <StarknetConfig
      defaultProvider={provider}
      connectors={[argentConnector]}
      autoConnect
    >
      {children}
    </StarknetConfig>
  );
} 