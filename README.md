# ClearSignal – Solana Wallet Risk Checker

Paste a Solana wallet address (or connect Phantom) and get an instant risk assessment of every coin you hold — rated **Accumulate**, **Hold**, **Caution**, **Avoid**, or **Exit** — in under 10 seconds.

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn-ui** (Radix primitives)
- **Supabase** (Postgres + Edge Functions + Auth)
- **React Router** for SPA routing
- **TanStack React Query** for data fetching
- **Vitest** + **React Testing Library** for unit tests
- **Playwright** for E2E tests

## Getting Started

```sh
# Install dependencies
npm install

# Start development server (port 8080)
npm run dev
```

### Environment Variables

Create a `.env.local` with:

```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run test` | Run unit tests (Vitest) |
| `npm run lint` | Run ESLint |
| `npx playwright test` | Run E2E tests (requires dev server) |

## Project Structure

```
src/
├── pages/          # Index (landing), Results, NotFound
├── components/     # EmailCaptureModal, RiskBadge, CoinTagPill, UpsellPanel, Footer
│   └── ui/         # shadcn-ui primitives
├── hooks/          # use-mobile, use-toast
├── integrations/   # Supabase client & auto-generated types
├── lib/            # constants, mock-wallet, utils
└── test/           # Vitest unit tests
tests/
└── e2e/            # Playwright E2E tests
supabase/
├── migrations/     # Postgres schema (leads, wallet_checks)
└── functions/      # wallet-check Edge Function
```

## Deployment

Deployed to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `main`.

### GitHub Secrets required

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g. `https://abc.supabase.co`) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID |
| `VITE_CUSTOM_DOMAIN` | Set to `true` once DNS for `clearsignal.app` points to GitHub Pages |

### ClearSignal API (Supabase Edge Function Secret)

The `wallet-check` edge function will call the real ClearSignal API when the `CLEARSIGNAL_API_URL` secret is set in Supabase; otherwise it returns generated sample data. To configure it:

```sh
supabase secrets set CLEARSIGNAL_API_URL=https://api.clearsignal.app
```

### Custom Domain

A `public/CNAME` file is included with `clearsignal.app`. To activate:

1. Point your DNS A/CNAME records at GitHub Pages (see [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)).
2. Enable the custom domain in **Settings → Pages** of this repository.
3. Add `VITE_CUSTOM_DOMAIN=true` to GitHub Secrets so Vite uses `/` as the base path instead of `/crystal-clear-sol/`.

### Phantom Wallet Connection

The **Connect wallet (read-only)** button uses the Phantom browser extension's injected `window.solana` provider. If Phantom is not installed, it opens the Phantom download page. No private keys or seed phrases are ever accessed — only the public address is read.
