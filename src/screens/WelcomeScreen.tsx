import React from 'react';
import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { Icon } from '../components/icons';
import { DemoBadge } from '../components/DemoBadge';
import { strings } from '../strings';
import { useWallet } from '../context/WalletContext';
import { appKit } from '../config/wagmi';

export const WelcomeScreen: React.FC = () => {
  const { openWalletSheet, isConnecting } = useWallet();

  const handleConnect = () => {
    try {
      appKit.open();
    } catch {
      openWalletSheet();
    }
  };

  const steps = [
    {
      icon: 'scan' as const,
      title: strings.welcome.step1Title,
      desc: strings.welcome.step1Desc,
    },
    {
      icon: 'swap' as const,
      title: strings.welcome.step2Title,
      desc: strings.welcome.step2Desc,
    },
    {
      icon: 'check' as const,
      title: strings.welcome.step3Title,
      desc: strings.welcome.step3Desc,
    },
  ];

  return (
    <div
      className="nexo-screen nexo-screen--welcome"
      style={{
        padding: '24px 20px 36px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minHeight: '100%',
        justifyContent: 'space-between',
      }}
    >
      {/* Topo: Logo & Badge */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
          }}
        >
          <Brand />
          <DemoBadge />
        </div>

        {/* Hero Section */}
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              backgroundColor: 'var(--accent-tint-7)',
              border: '1px solid var(--accent-border-25)',
              color: 'var(--accent)',
              fontSize: 'max(var(--min-text), 11px)',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            <Icon name="shield" size={13} />
            <span>{strings.welcome.nonCustodialBadge}</span>
          </div>

          <h1
            style={{
              margin: '0 0 12px',
              fontSize: 'max(var(--min-text), 26px)',
              fontWeight: 750,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
            }}
          >
            {strings.welcome.heroTitle}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 'max(var(--min-text), 13px)',
              color: 'var(--muted)',
              lineHeight: 1.5,
            }}
          >
            {strings.welcome.heroSubtitle}
          </p>
        </div>

        {/* 3 Passos explicativos */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '32px',
          }}
        >
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="nexo-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '14px 16px',
                borderRadius: '18px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--surface-3)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={s.icon} size={18} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: 'max(var(--min-text), 13px)',
                    fontWeight: 650,
                    color: 'var(--text)',
                    marginBottom: '2px',
                  }}
                >
                  {s.title}
                </span>
                <span
                  style={{
                    fontSize: 'max(var(--min-text), 11px)',
                    color: 'var(--muted)',
                    lineHeight: 1.4,
                  }}
                >
                  {s.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ação Principal: Conectar Carteira */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Button
          variant="primary"
          onClick={handleConnect}
          disabled={isConnecting}
          style={{
            width: '100%',
            height: '52px',
            borderRadius: '16px',
            fontSize: 'max(var(--min-text), 14px)',
            fontWeight: 700,
          }}
        >
          <Icon name="wallet" size={18} style={{ marginRight: '8px' }} />
          {isConnecting ? strings.welcome.connecting : strings.welcome.connectWallet}
        </Button>

        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: 'max(var(--min-text), 10px)',
            color: 'var(--muted)',
            lineHeight: 1.4,
          }}
        >
          {strings.welcome.nonCustodialDesc}
        </p>
      </div>
    </div>
  );
};
