import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './config/wagmi';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ReaderScreen } from './screens/ReaderScreen';
import { ReviewPaymentScreen } from './screens/ReviewPaymentScreen';
import { ProcessingScreen } from './screens/ProcessingScreen';
import { ResultScreen } from './screens/ResultScreen';
import { WalletScreen } from './screens/WalletScreen';
import { AssetDetailScreen } from './screens/AssetDetailScreen';
import { AddFundsScreen } from './screens/AddFundsScreen';
import { ReceiveCryptoScreen } from './screens/ReceiveCryptoScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { ActivityDetailScreen } from './screens/ActivityDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNav } from './components/BottomNav';
import { PaymentProvider } from './context/PaymentContext';
import { WalletProvider, useWallet } from './context/WalletContext';
import { ServicesProvider } from './services';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { WalletSheet } from './components/WalletSheet';
import { PaymentWalletWatcher } from './components/PaymentWalletWatcher';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isConnected } = useWallet();

  // A barra inferior aparece somente quando conectado nestas 5 telas:
  const showBottomNav =
    isConnected &&
    ['/', '/carteira', '/pagar', '/atividade', '/perfil'].includes(location.pathname);

  return (
    <div className="nexo-app-frame">
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Tela Início ou Boas-Vindas */}
          <Route path="/" element={isConnected ? <HomeScreen /> : <WelcomeScreen />} />

          {/* Fluxo Pagar */}
          <Route path="/pagar" element={isConnected ? <ReaderScreen /> : <Navigate to="/" replace />} />
          <Route path="/pagar/revisar" element={isConnected ? <ReviewPaymentScreen /> : <Navigate to="/" replace />} />
          <Route path="/pagar/processando" element={isConnected ? <ProcessingScreen /> : <Navigate to="/" replace />} />
          <Route path="/pagar/resultado" element={isConnected ? <ResultScreen /> : <Navigate to="/" replace />} />

          {/* Fluxo Carteira & Gestão de Cripto */}
          <Route path="/carteira" element={isConnected ? <WalletScreen /> : <Navigate to="/" replace />} />
          <Route path="/carteira/ativo" element={isConnected ? <AssetDetailScreen /> : <Navigate to="/" replace />} />
          <Route path="/adicionar-fundos" element={isConnected ? <AddFundsScreen /> : <Navigate to="/" replace />} />
          <Route path="/receber" element={isConnected ? <ReceiveCryptoScreen /> : <Navigate to="/" replace />} />

          {/* Fluxo Atividade */}
          <Route path="/atividade" element={isConnected ? <ActivityScreen /> : <Navigate to="/" replace />} />
          <Route path="/atividade/detalhe" element={isConnected ? <ActivityDetailScreen /> : <Navigate to="/" replace />} />

          {/* Perfil & Ações de Segurança */}
          <Route path="/perfil" element={isConnected ? <ProfileScreen /> : <Navigate to="/" replace />} />

          {/* Rota padrão */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Barra de navegação inferior exibida somente quando autenticado */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <ThemeProvider>
            <ToastProvider>
              <WalletProvider>
                <ServicesProvider>
                  <PaymentProvider>
                    <PaymentWalletWatcher />
                    <AppContent />
                    <WalletSheet />
                  </PaymentProvider>
                </ServicesProvider>
              </WalletProvider>
            </ToastProvider>
          </ThemeProvider>
        </HashRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
