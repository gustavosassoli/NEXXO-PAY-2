import { SignJWT, jwtVerify } from 'jose';
import { unauthorized } from './http';

const issuer = 'nexxo-pay-api';
const audience = 'nexxo-pay-web';

function secret(): Uint8Array {
  const value = process.env.NEXXO_JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error('NEXXO_JWT_SECRET deve ter no mínimo 32 caracteres.');
  }
  return new TextEncoder().encode(value);
}

export async function createSession(userId: string, walletAddress: string): Promise<string> {
  return new SignJWT({ walletAddress })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function requireSession(request: Request): Promise<
  { userId: string; walletAddress: string } | Response
> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return unauthorized();

  try {
    const { payload } = await jwtVerify(token, secret(), { issuer, audience });
    if (!payload.sub || typeof payload.walletAddress !== 'string') return unauthorized();
    return { userId: payload.sub, walletAddress: payload.walletAddress };
  } catch {
    return unauthorized();
  }
}
