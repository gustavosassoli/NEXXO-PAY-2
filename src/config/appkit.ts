/**
 * NEXO PAY - Configuração do Reown AppKit (anteriormente Web3Modal)
 *
 * Provê autenticação Web3 integrada com suporte a:
 * - MetaMask, Rainbow, Trust Wallet, Rabby, Coinbase Wallet e mais de 350 carteiras
 * - Social Logins (Google, Email OTP)
 * - Rede Polygon PoS e token USDC nativo
 */

import { POLYGON_CHAIN_ID, getChain } from './chains';

export const REOWN_PROJECT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WALLETCONNECT_PROJECT_ID) ||
  '31d2dd4ad4b424bb58d9de171774869b';

export const appKitMetadata = {
  name: 'NEXO PAY',
  description: 'Pague qualquer Pix com liquidação em criptoativos',
  url: 'https://nexxopay.app',
  icons: ['https://nexxopay.app/pwa-192x192.png'],
};

export const appKitThemeVariables = {
  '--w3m-accent': '#00DC82',
  '--w3m-color-mix': '#0A0A0C',
  '--w3m-color-mix-strength': 40,
  '--w3m-border-radius-master': '18px',
  '--w3m-font-family': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

/**
 * Retorna se o Reown AppKit está habilitado com um Project ID válido
 */
export function isAppKitConfigured(): boolean {
  return Boolean(REOWN_PROJECT_ID && REOWN_PROJECT_ID.trim().length > 0);
}
