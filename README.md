# POS Modification & Add-on UI

A single-screen interface for choosing product **modifications and add-ons** in a
Point-of-Sale system. It replaces a disjointed, multi-step flow with one intuitive
screen — faster for cashiers and better for upselling.

**Live demo:** https://qopla-pos-sdpo.vercel.app

## Tech stack

React · TypeScript · Vite · Tailwind CSS v4 · Vitest · React Testing Library

## What it demonstrates

- **Clean state management** — centralised with React's Context API, keeping
  business logic (price calculation, selection limits) out of presentational
  components and avoiding prop drilling.
- **Component-based architecture** — small, reusable, self-contained components
  (`ModificationSelector`, `AddonSelector`, `PriceDisplay`, …).
- **Robustness** — wrapped in a custom Error Boundary that catches runtime
  rendering errors and shows a fallback UI.
- **Testable core** — critical business logic (e.g. price calculation) is
  extracted into pure utility functions.
- **A real testing strategy** — Vitest + React Testing Library, with unit tests
  for the price logic and integration tests that simulate clicks to verify
  add-on limits are enforced in the UI.

## Run locally

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
