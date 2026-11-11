/**
 * NEXO PAY - Configuração do Reown AppKit com WagmiAdapter
 *
 * Provê conexão moderna com mais de 350 carteiras Web3 (MetaMask, Rainbow, Trust Wallet, etc.)
 * e autenticação social simplificada (Google, E-mail OTP) com carteiras inteligentes não-custodiais.
 */

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { polygon } from '@reown/appkit/networks';

export const projectId =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WALLETCONNECT_PROJECT_ID) ||
  '31d2dd4ad4b424bb58d9de171774869b';

export const networks: [typeof polygon, ...any[]] = [polygon];

export const metadata = {
  name: 'NEXO PAY',
  description: 'Pague qualquer Pix com liquidação em criptoativos',
  url: 'https://nexxopay.app',
  icons: ['https://nexxopay.app/pwa-192x192.png'],
};

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#00DC82',
    '--w3m-color-mix': '#0A0A0C',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '18px',
  },
  features: {
    analytics: false,
    email: true,
    socials: ['google', 'x', 'apple', 'discord'],
    emailShowWallets: true,
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
