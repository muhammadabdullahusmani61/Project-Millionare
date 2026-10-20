# USMANI OS

Personal productivity, business-building, and long-term wealth operating system.

## Foundation

The current stage establishes the App Router shell, dashboard foundation, private Supabase authentication, approved-device access, navigation map, and placeholder module routes.

Supabase infrastructure is defined in `supabase/migrations`. Apply it with the Supabase CLI using `supabase db push` after linking this project with `supabase link`. The CLI is intentionally not bundled as an application dependency.

After linking the project, generate typed database definitions with `npm run db:types`. The generated `types/database.ts` file should be committed and refreshed whenever migrations change.

## Private access configuration

Set these variables in the deployment environment or `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
AUTHORIZED_USER_ID=
```

Set `AUTHORIZATION_MODE=development` in `.env.development.local` for local development. Cloudflare configuration supplies `AUTHORIZATION_MODE` from its explicit deployment mode and rejects missing or unsupported modes; production deployment must use `--mode production`.

`AUTHORIZED_USER_ID` and `AUTHORIZATION_MODE` are server-only. There is no public signup flow. Production requires an approved device credential and permits at most three active devices. Credentials are stored only in secure HttpOnly cookies and their hashes are stored in `user_devices`.

Local development still uses the Supabase project configured in `.env.local` for authentication and other application data. It skips production device-credential checks and never reads or mutates production `user_devices` rows; this is not full database isolation.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
