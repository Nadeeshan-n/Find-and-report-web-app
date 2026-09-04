# CampusFind

CampusFind is a university lost & found web app that lets students report lost or found items, browse active reports, and get automatically matched with likely counterparts through a scoring-based matching engine.

## Features

- **Report items** — submit a "lost" or "found" report with category, description, color, brand, location, date/time, and an optional photo.
- **Browse & search** — filter and search through all active lost/found listings.
- **Automated matching engine** — a deterministic, weighted scoring algorithm compares lost and found reports and surfaces likely matches based on:
  - Category match (+40%)
  - Location proximity (+25% / +15% for nearby buildings)
  - Shared description keywords (+25% / +10%)
  - Additional attribute overlap (+10%)
- **My Reports** — track the status of items you've reported (active, possible match, contacted, returned, closed).
- **In-thread messaging** — contact a reporter directly about a potential match.
- **Admin dashboard** — search, filter, sort, update status, or remove any report across the system.
- **Local persistence** — reports, "my reports," and messages persist in the browser via `localStorage`, with mock seed data provided out of the box.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vitejs.dev/) — dev server & build tooling
- [React Router 7](https://reactrouter.com/) — client-side routing
- [Tailwind CSS 4](https://tailwindcss.com/) — styling
- [lucide-react](https://lucide.dev/) — icons
- [motion](https://motion.dev/) — animation

## Project Structure

```
src/
├── components/       # Reusable UI (Navbar, Footer, ItemCard, MatchCard, modals)
├── context/          # ReportContext — global state, matching, persistence
├── pages/            # Route-level views (Home, Browse, ItemDetails, ReportForm, MyReports, Admin)
├── mockData.ts        # Seed reports + matching engine (calculateMatchScore, findMatchesForReport)
├── types.ts          # Shared TypeScript types (Report, Match, Message, etc.)
├── App.tsx           # Router & layout
└── main.tsx          # Entry point
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm, or [Bun](https://bun.sh/) (a `bun.lock` is included)

### Installation

```bash
git clone https://github.com/Nadeeshan-n/Find-and-report-web-app.git
cd Find-and-report-web-app
npm install
```

### Run the dev server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run clean` | Remove build artifacts |

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/browse` | Browse all reports |
| `/item/:id` | Item details & matches |
| `/report` | Report a lost or found item |
| `/my-reports` | Your submitted reports |
| `/admin` | Admin dashboard |

## Notes

- All data is currently mocked and stored client-side in `localStorage` — there is no backend or database.
- This project was scaffolded from a template that includes the `@google/genai` package, but it is not currently wired into any feature in the app.

## License

No license specified.
