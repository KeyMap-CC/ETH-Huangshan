import React from 'react';
import { Icon } from '@chakra-ui/react';

export const EthereumIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"
    />
  </Icon>
);

export const PolygonIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 0l12 12-12 12L0 12 12 0zm.72 7.2c-.48-.48-1.2-.72-1.92-.72-.72 0-1.44.24-1.92.72l-3.84 3.84c-.48.48-.72 1.2-.72 1.92s.24 1.44.72 1.92l3.84 3.84c.48.48 1.2.72 1.92.72.72 0 1.44-.24 1.92-.72l3.84-3.84c.48-.48.72-1.2.72-1.92s-.24-1.44-.72-1.92L12.72 7.2zm-.24 7.44l-2.4-2.4 2.4-2.4 2.4 2.4-2.4 2.4z"
    />
  </Icon>
);

export const TestnetIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
    />
  </Icon>
);

export const getNetworkIcon = (chainId) => {
  // Mainnet chains
  if (chainId === 1) return <EthereumIcon color="#627EEA" />;
  if (chainId === 137) return <PolygonIcon color="#8247E5" />;
  
  // Testnet chains
  if (chainId === 5 || chainId === 11155111) return <EthereumIcon color="#F6C343" />; // Ethereum testnets
  if (chainId === 80001) return <PolygonIcon color="#8247E5" opacity={0.7} />; // Mumbai testnet
  
  // Default
  return <TestnetIcon color="gray.500" />;
};
