/**
 * NEXO PAY - Configurações da aplicação.
 */

/**
 * Modo demonstração.
 * Quando false, remove:
 * - 'Simular leitura válida'
 * - 'Testar erro'
 * - Aviso demonstrativo do leitor
 * - Chips de pré-visualização de estados em Resultado
 * - Selo AMBIENTE DEMONSTRATIVO
 */
export const DEMO_MODE = true;

/**
 * Modo da câmera no leitor de QR Code:
 * - 'real': usa navigator.mediaDevices.getUserMedia com BarcodeDetector/jsQR.
 *           Oculta botões de simulação e a nota 'Protótipo demonstrativo'.
 * - 'simulated': exibe botões de simulação sem acessar câmera (comportamento W1).
 */
export const CAMERA_MODE: 'real' | 'simulated' = 'real';

/**
 * Modo dos serviços da camada de pagamento:
 * - 'mock': usa serviços simulados em memória (W6).
 * - 'real': pluga provedor Pix, backend e carteira Web3 real.
 */
export const SERVICES_MODE: 'mock' | 'real' = 'mock';

/**
 * Modo de consulta de saldo:
 * - 'chain': lê o saldo real do USDC nativo na Polygon via viem/RPC da blockchain (W7).
 * - 'mock': usa saldos estáticos mockados em memória.
 */
export const BALANCE_MODE: 'mock' | 'chain' = 'chain';

/**
 * Exibição do rodapé de diagnóstico técnico no leitor de QR Code.
 * Por padrão false, mantendo o visual fiel ao design original.
 */
export const SHOW_DIAGNOSTICS: boolean = false;

/**
 * Endereço da carteira de recebimento/liquidação da plataforma NEXXO na Polygon.
 * Configurável via VITE_PLATFORM_RECEIVING_ADDRESS.
 */
export const PLATFORM_RECEIVING_ADDRESS: `0x${string}` =
  ((typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_PLATFORM_RECEIVING_ADDRESS) as `0x${string}`) ||
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

