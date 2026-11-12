import { getAddress, isAddress, verifyMessage } from 'viem';
import { sql } from '../_lib/db';
import { badRequest, json, unauthorized } from '../_lib/http';
import { createSession } from '../_lib/session';

async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405);

  const body = await request.json().catch(() => null);
  const { address, message, signature, nonce } = body ?? {};
  if ([address, message, signature, nonce].some((value) => typeof value !== 'string') || !isAddress(address)) {
    return badRequest('Dados de autenticação inválidos.');
  }

  const normalizedAddress = getAddress(address);
  const [challenge] = await sql`
    SELECT nonce, address, expires_at, consumed_at
    FROM auth_nonces
    WHERE nonce = ${nonce}
    LIMIT 1
  `;
  if (!challenge || challenge.address !== normalizedAddress || challenge.consumed_at || new Date(challenge.expires_at) <= new Date()) {
    return unauthorized();
  }

  const validSignature = await verifyMessage({
    address: normalizedAddress,
    message,
    signature: signature as `0x${string}`,
  });
  if (!validSignature || !message.includes(`Nonce: ${nonce}`) || !message.includes(`Carteira: ${normalizedAddress}`)) {
    return unauthorized();
  }

  await sql`UPDATE auth_nonces SET consumed_at = now() WHERE nonce = ${nonce} AND consumed_at IS NULL`;

  const [wallet] = await sql`
    SELECT w.id AS wallet_id, w.user_id
    FROM wallets w
    WHERE w.address = ${normalizedAddress} AND w.chain_id = 137
    LIMIT 1
  `;

  let userId: string;
  if (wallet) {
    userId = wallet.user_id;
  } else {
    const [user] = await sql`INSERT INTO users DEFAULT VALUES RETURNING id`;
    userId = user.id;
    await sql`
      INSERT INTO wallets (user_id, address, chain_id, is_primary)
      VALUES (${userId}, ${normalizedAddress}, 137, true)
    `;
  }

  const token = await createSession(userId, normalizedAddress);
  return json({ token, user: { id: userId, walletAddress: normalizedAddress } });
}

export default { fetch: handler };
