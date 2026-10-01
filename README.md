This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## AI Chat Setup

Marco uses an OpenAI-compatible chat completions API for questions that are not covered by the store's built-in answers. Add `OPENAI_API_KEY` to your existing `.env.local` and restart the development server; keep the other settings already in that file. The key stays on the server and must not use a `NEXT_PUBLIC_` prefix.

`OPENAI_MODEL` defaults to `gpt-4o-mini`. For an OpenAI-compatible provider, set `OPENAI_BASE_URL` to its API base URL. Model responses can still be incorrect; MarketLink-specific answers are constrained to the catalog and policy context included with each request.

## Farmer Account Sessions

Set `SESSION_SECRET` to a long, random server-only value in production. Farmer sessions use a signed, HTTP-only cookie and each farmer is associated with one producer through `farmer_profiles.user_id`. Local development uses a development-only signing secret when `SESSION_SECRET` is not set.

## MySQL Database

Account registration, farmer profiles, and product changes require a reachable MySQL database. Configure `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` in `.env.local`, then run `schema.sql` against that server. Without MySQL, read-only catalog pages use demo data, but database writes return an error instead of claiming they were saved.

## Admin Access

Configure server-only `ADMIN_EMAIL` and `ADMIN_PASSWORD` values for environment-based administrator login, or provision an administrator account in the database. Demo and default admin credentials are disabled. New account passwords are stored as salted scrypt hashes; existing plain-text database passwords are upgraded after a successful login.

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
