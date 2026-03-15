# ClearSignal – Solana Wallet Risk Checker

Paste a Solana wallet address (or connect Phantom) and get an instant risk assessment of every coin you hold — rated **Accumulate**, **Hold**, **Caution**, **Avoid**, or **Exit** — in under 10 seconds.

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn-ui** (Radix primitives)
- **Supabase** (Postgres + Edge Functions + Auth)
- **React Router** for SPA routing
- **TanStack React Query** for data fetching
- **Vitest** + **React Testing Library** for unit tests

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
| `npm run test` | Run unit tests |
| `npm run lint` | Run ESLint |

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
supabase/
├── migrations/     # Postgres schema (leads, wallet_checks)
└── functions/      # wallet-check Edge Function
```

## Deployment

Deployed to **GitHub Pages** via `.github/workflows/deploy.yml` on every push to `main`.
