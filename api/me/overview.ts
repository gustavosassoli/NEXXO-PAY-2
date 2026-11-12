import { json } from '../_lib/http';
import { requireSession } from '../_lib/session';
import { sql } from '../_lib/db';

async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') return json({ error: 'Método não permitido.' }, 405);
  const session = await requireSession(request);
  if (session instanceof Response) return session;

  const [profile] = await sql`
    SELECT u.id, u.display_name, w.address AS wallet_address
    FROM users u
    JOIN wallets w ON w.user_id = u.id AND w.is_primary = true
    WHERE u.id = ${session.userId}
    LIMIT 1
  `;
  const positions = await sql`
    SELECT ap.asset_symbol, ap.decimals, ap.amount, ap.chain_id, ap.observed_at
    FROM asset_positions ap
    JOIN wallets w ON w.id = ap.wallet_id
    WHERE w.user_id = ${session.userId}
    ORDER BY ap.asset_symbol
  `;
  const activities = await sql`
    SELECT id, status, asset_symbol, asset_decimals, asset_amount, pix_amount_cents,
      merchant_name, crypto_tx_hash, pix_end_to_end_id, created_at
    FROM payments
    WHERE user_id = ${session.userId}
    ORDER BY created_at DESC
    LIMIT 20
  `;

  return json({ profile, positions, activities });
}

export default { fetch: handler };
