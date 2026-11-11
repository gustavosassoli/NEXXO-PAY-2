# Backend do NEXXO PAY (MVP)

O frontend nunca deve decidir se um Pix foi pago, nem aceitar um endereço de carteira como identidade sem prova criptográfica. A API usa uma assinatura da carteira para criar uma sessão curta e armazena o estado operacional no PostgreSQL.

## O que persiste

- `users` e `wallets`: a identidade é vinculada ao endereço Polygon, não ao e-mail declarado pelo navegador;
- `auth_nonces`: desafios de uso único e curta duração para evitar replay;
- `payments` e `payment_events`: histórico/auditoria da máquina de estados;
- `asset_positions`: cache de saldos observados. O débito só pode usar saldo confirmado on-chain.

## Provisionamento

1. Crie um banco PostgreSQL no Neon e guarde a URL em `DATABASE_URL` na Vercel.
2. Execute `db/schema.sql` no console SQL do banco.
3. Gere um segredo aleatório de pelo menos 32 caracteres para `NEXXO_JWT_SECRET`.
4. Defina `NEXXO_APP_ORIGIN` como a URL final do app.
5. Faça deploy e valide `GET /api/health`.

## Endpoints iniciais

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/api/auth/challenge` | Cria mensagem e nonce para assinatura da carteira. |
| POST | `/api/auth/verify` | Valida a assinatura, cria/recupera o usuário e retorna sessão JWT. |
| GET | `/api/me/overview` | Retorna perfil, posições já indexadas e histórico do usuário autenticado. |
| GET | `/api/health` | Verificação de disponibilidade sem dados sensíveis. |

## Próximas integrações obrigatórias

1. O cliente assina o challenge com a carteira e envia o JWT em `Authorization: Bearer`.
2. Um indexador consulta USDC, USDT e ETH de cada carteira e atualiza `asset_positions`.
3. O `PaymentService` passa a criar e acompanhar pagamentos pela API; o PSP só é chamado após a confirmação on-chain.
4. Relatórios são gerados a partir de `payments` e `payment_events`, não de dados da interface.
