-- NEXXO PAY — modelo de dados do MVP
-- Execute uma vez no PostgreSQL gerenciado antes de liberar a API em produção.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (chain_id, address)
);

CREATE UNIQUE INDEX IF NOT EXISTS wallets_one_primary_per_user
  ON wallets (user_id) WHERE is_primary;

CREATE TABLE IF NOT EXISTS auth_nonces (
  nonce TEXT PRIMARY KEY,
  address TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE payment_status AS ENUM (
  'CREATED', 'QUOTED', 'AWAITING_CRYPTO', 'CRYPTO_CONFIRMED',
  'PAYING_PIX', 'PIX_PENDING', 'COMPLETED', 'REFUNDING',
  'REFUNDED', 'EXPIRED', 'FAILED'
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  idempotency_key TEXT NOT NULL UNIQUE,
  status payment_status NOT NULL,
  asset_symbol TEXT NOT NULL,
  asset_decimals SMALLINT NOT NULL,
  asset_amount NUMERIC(78, 0) NOT NULL,
  pix_amount_cents BIGINT NOT NULL,
  fee_amount_cents BIGINT NOT NULL DEFAULT 0,
  pix_txid TEXT,
  pix_end_to_end_id TEXT,
  crypto_tx_hash TEXT,
  merchant_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payment_events (
  id BIGSERIAL PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  status payment_status NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posições são cache/auditoria. O saldo disponível para gastar é sempre confirmado on-chain.
CREATE TABLE IF NOT EXISTS asset_positions (
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  chain_id INTEGER NOT NULL,
  asset_symbol TEXT NOT NULL,
  decimals SMALLINT NOT NULL,
  amount NUMERIC(78, 0) NOT NULL,
  block_number BIGINT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (wallet_id, chain_id, asset_symbol)
);

CREATE INDEX IF NOT EXISTS payments_user_created_idx ON payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_events_payment_idx ON payment_events (payment_id, created_at);
