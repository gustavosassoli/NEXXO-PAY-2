import { json } from './_lib/http';

function handler(request: Request): Response {
  if (request.method !== 'GET') return json({ error: 'Método não permitido.' }, 405);
  return json({ service: 'nexxo-pay-api', status: 'ok', timestamp: new Date().toISOString() });
}

export default { fetch: handler };
