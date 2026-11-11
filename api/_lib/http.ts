export const json = (body: unknown, status = 200): Response =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });

export const badRequest = (message: string): Response => json({ error: message }, 400);

export const unauthorized = (): Response => json({ error: 'Sessão inválida ou expirada.' }, 401);
