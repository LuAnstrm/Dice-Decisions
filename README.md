# Dice & Decisions

Probability-powered Dungeon Master command center for homebrew RPG campaigns.

Live site:
https://dice-and-decisions.vercel.app

GitHub repository:
https://github.com/LuAnstrm/Dice-Decisions

## Overview

Dice & Decisions combines campaign management tools with interactive probability features:

- Probability cards for encounter outcomes
- Bayes analyzer with RPG scenarios
- Dice distribution visualizer
- Character sheets for beginner-friendly play
- Campaign tools for NPCs, encounters, notes, and maps
- Preloaded demo campaign: Tower of Fate

## Current Data Model

This version runs in local mode with no external database dependency.

- App data client lives under src/lib/data-client
- Local persistence is implemented in src/lib/local-db.ts
- Premade campaign content is sourced from src/lib/seed/tower-of-fate.ts

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Recharts
- Zustand
- React Hook Form + Zod
- Tiptap

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Repository Hygiene

The repository intentionally excludes generated and local-only files such as:

- node_modules
- .next
- .vercel
- .env.local
- tsconfig.tsbuildinfo
- local logs

See .gitignore for the full list.

## License

School project, not licensed for commercial use.
