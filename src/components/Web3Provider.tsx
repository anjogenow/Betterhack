'use client';

import { StarknetConfig, InjectedConnector } from '@starknet-react/core';

export const argentConnector = new InjectedConnector({ 
  options: { id: 'argentX' } 
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig 
      connectors={[argentConnector]}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
} 