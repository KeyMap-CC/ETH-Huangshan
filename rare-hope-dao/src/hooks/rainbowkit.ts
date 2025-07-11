import { createConfig, fallback, http } from '@wagmi/core';
import { holesky } from 'wagmi/chains';
import {
  metaMaskWallet,
  walletConnectWallet,
  trustWallet,
  okxWallet,
  coinbaseWallet,
  imTokenWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

const appName = 'Rare Hope DAO';
const projectId = import.meta.env.VITE_PROJECT_ID || 'MISSING_PROJECT_ID';

const appInfo = {
  appName: appName,
};

const wallets = [
  {
    groupName: 'Recommended',
    wallets: [metaMaskWallet, walletConnectWallet, trustWallet, okxWallet],
  },
  {
    groupName: 'Popular',
    wallets: [coinbaseWallet, imTokenWallet, rainbowWallet],
  },
];
const connectors = connectorsForWallets([...wallets], {
  appName,
  projectId,
});

const rainbowkitConfig = import.meta.env.DEV
  ? createConfig({
      chains: [holesky],
      ssr: true,
      connectors: connectors,
      transports: {
        [holesky.id]: fallback([
          http('https://ethereum-holesky.publicnode.com'),
          http('https://ethereum-holesky-rpc.publicnode.com'),
          http('https://endpoints.omniatech.io/v1/eth/holesky/public'),
          http('https://1rpc.io/holesky'),
        ]),
      },
    })
  : createConfig({
      chains: [holesky],
      ssr: true,
      connectors: connectors,
      transports: {
        [holesky.id]: fallback([
          http('https://ethereum-holesky.publicnode.com'),
          http('https://ethereum-holesky-rpc.publicnode.com'),
          http('https://endpoints.omniatech.io/v1/eth/holesky/public'),
          http('https://1rpc.io/holesky'),
        ]),
      },
    });

export { rainbowkitConfig, appInfo };
