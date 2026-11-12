import { randomUUID } from 'node:crypto';
import { getAddress, isAddress } from 'viem';
import { sql } from '../_lib/db';
import { badRequest, json } from '../_lib/http';

const chainId = 137;

async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const body = await request.json().catch(() => null);
  const address = body?.address;
  if (typeof address !== 'string' || !isAddress(address)) {
    return badRequest('Endereço de carteira inválido.');
  }

  const normalizedAddress = getAddress(address);
  const nonce = randomUUID();
  const expiresAt = new Date(Date.now() + 5 * 60_000).toISOString();
  const origin = process.env.NEXXO_APP_ORIGIN || new URL(request.url).origin;
  const message = [
    'NEXXO PAY solicita a assinatura para iniciar uma sessão segura.',
    `Domínio: ${origin}`,
    `Carteira: ${normalizedAddress}`,
    `Rede: Polygon (${chainId})`,
    `Nonce: ${nonce}`,
    `Expira em: ${expiresAt}`,
  ].join('\n');

  await sql`DELETE FROM auth_nonces WHERE expires_at < now() OR consumed_at IS NOT NULL`;
  await sql`INSERT INTO auth_nonces (nonce, address, expires_at) VALUES (${nonce}, ${normalizedAddress}, ${expiresAt})`;

  return json({ message, nonce, expiresAt, chainId });
}

export default { fetch: handler };
