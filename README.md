# DevQuoteX — Instant Web Development Quotes

DevQuoteX streamlines website scoping and pricing for clients and developers. It provides instant, transparent quotes with clear breakdowns, built-in guardrails, and a polished UI for a professional handoff.

## What this project is for

- Quickly estimate web project costs with a guided quote builder.
- Share transparent breakdowns and PDF summaries with clients.
- Keep scope under control using sensible defaults and guardrails.
- Offer a clean developer flow for managing quotes and onboarding.

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn-ui (Radix UI primitives)

## Getting Started

Prerequisites:
- Node.js and npm installed

Install and run:

```sh
# Clone the repository
git clone https://github.com/august-web/dev-quoteX
cd dev-quoteX

# Install dependencies
npm install

# Start the dev server
npm run dev

# Lint and build
npm run lint
npm run build
```

## Scripts

- `npm run dev` — start the development server (Vite)
- `npm run build` — build for production into `dist`
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint across the project

## Deployment

This is a Single-Page Application (SPA).

- Vercel: `vercel.json` is configured to route all paths to `index.html` and build with `npm run build` outputting `dist`.
- Netlify: `public/_redirects` contains `/* /index.html 200` for SPA routing. Use build command `npm run build` and publish directory `dist`.

## Author

Built by Augustine (`august-web`).
