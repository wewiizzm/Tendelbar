# Tendel Bar e Lancheria

Projeto pronto para deploy na Vercel com:

- frontend estatico em HTML, CSS e JavaScript
- Vercel Functions em `api/`
- persistencia em PostgreSQL serverless
- autenticacao de administrador e cozinha por cookie HTTP-only

## Estrutura

- `index.html`: cardapio publico
- `admin.html`: painel administrativo
- `style.css`: estilos globais
- `script.js`: comportamento do cardapio publico
- `admin.js`: comportamento do painel administrativo
- `logo-animation.js`: animacao suave da logo
- `api/`: backend para Vercel Functions
- `db/schema.sql`: schema PostgreSQL usado pela aplicacao
- `scripts/check.mjs`: validacao local de sintaxe e estrutura

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `POSTGRES_URL` ou `DATABASE_URL`
- `STATE_STORAGE_KEY` (opcional)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ORDERS_ACCESS_USERNAME`
- `ORDERS_ACCESS_PASSWORD`
- `SESSION_SECRET`
- `PUBLIC_WHATSAPP_NUMBER`

## Rodando localmente

```bash
npm install
npm run check
npm run dev
```

## Banco de dados

- O projeto usa a tabela `tendel_app_state` em PostgreSQL.
- O schema esta em `db/schema.sql`.
- A tabela e criada automaticamente na primeira requisicao da API.
- O estado do cardapio e dos pedidos fica salvo em uma coluna `JSONB` para manter a estrutura atual simples e pronta para deploy serverless.

## Publicando na Vercel

1. Suba o projeto para o GitHub.
2. Importe o repositorio na Vercel.
3. Adicione uma integracao PostgreSQL pelo Marketplace da Vercel.
4. Confirme que a variavel `POSTGRES_URL` ou `DATABASE_URL` foi disponibilizada no projeto.
5. Configure as demais variaveis de ambiente.
6. Use Node.js `24.x` no projeto ou mantenha o `package.json` como fonte dessa configuracao.
7. Mantenha o Build Command vazio.
8. Mantenha o Output Directory vazio.
9. Faca o deploy.

## Checklist exata da Vercel

- Framework Preset: `Other`
- Root Directory: `.`
- Install Command: padrao da Vercel
- Build Command: vazio
- Output Directory: vazio
- Node.js: `24.x`
- Variavel obrigatoria de banco: `POSTGRES_URL` ou `DATABASE_URL`
- Variaveis obrigatorias da aplicacao: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ORDERS_ACCESS_USERNAME`, `ORDERS_ACCESS_PASSWORD`, `SESSION_SECRET`, `PUBLIC_WHATSAPP_NUMBER`
- Variavel opcional: `STATE_STORAGE_KEY`
- Nao configurar `builds` legacy no `vercel.json`
- Nao usar armazenamento local em disco como fonte de dados

## Observacao importante

Pelas documentacoes atuais da Vercel, atualizadas em 22 de julho de 2025, o antigo produto Vercel Postgres deixou de ser oferecido diretamente. O fluxo recomendado hoje e conectar um provedor PostgreSQL via Marketplace da Vercel, como Neon.
