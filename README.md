# One-Stop-Shop Prototype

Internal-facing prototype that unifies mocked RL1-style metadata, marketing assets, screening video, and Salesforce-like opportunities for scripted titles. Everything runs locally with mock JSON data and local files only.

## Project structure

```
one-stop-shop/
├── package.json             # Workspace scripts
├── server/
│   ├── server.js            # Express API with RBAC filters
│   └── data/                # Mock titles, opportunities, users
└── client/
    ├── src/                 # React + Vite UI
    └── public/assets/       # PDFs, SVGs, placeholder MP4
```

## Getting started

```bash
cd /Users//one-stop-shop
npm install          # installs root + workspaces
npm run dev          # starts Express (4000) + Vite (5173)
```

Open http://localhost:5173 to use the tool. The frontend calls the API at http://localhost:4000/api.

### Available roles
- **Admin** – full access including sensitive investment notes and opportunities
- **Sales** – hides `investment.sensitive`, still sees deal flow
- **Viewer** – hides all investment data and Salesforce panels

### Mock datasets
- `server/data/titles.json` – RL1-style metadata (episodes, credits, investment, screening URL, marketing files)
- `server/data/opportunities.json` – Salesforce-style opps linked by `title_id`
- `server/data/users.json` – role catalog powering the role switcher

### Marketing assets and screening video
All referenced files live under `client/public/assets/` and are served directly by Vite / the production build:
- `assets/docs/*.pdf` – tiny placeholder PDFs
- `assets/images/*.svg` – simple SVG key art / sheets
- `assets/video/placeholder.mp4` – 5-second public sample clip

## Production-style build

```bash
npm run build           # builds the React app (output in client/dist)
npm run start           # starts only the Express API (port 4000)
```

To serve the static build, host the contents of `client/dist` behind any static server and keep the Express API running separately (or adjust to serve static files if desired).

## Discovery workflow
- Hero dashboard surfaces total titles plus counts with assets, opportunities, and ready episodes.
- Filter chips toggle "Has Assets" and "Has Opportunities" before drilling into any package.
- Sort controls (A→Z, Most Episodes, Recently Added) reshuffle the paginated grid.
- Pagination supports up to 50 rows per page so browsing 50,000+ records stays quick even before running a search.

## Routing

The app uses React Router for navigation:

- `/` - Discovery/browse page with search, filters, and paginated grid
- `/title/:titleId` - Individual title detail page showing all metadata

Clicking any title card navigates to its dedicated page (`/title/T-001`, etc.) where all data points are displayed:
- Hero image (16:9 artwork)
- Title ID, name, synopsis
- Investment details (role-filtered)
- Complete episode list
- Full credits
- Marketing assets
- Salesforce opportunities (if role allows)
- Internal screening video player

Use the "Back to Discovery" button to return to the browse view.

## Table Browse Layout

The discovery page now uses a table layout optimized for browsing hundreds of titles:

- **Table columns**: Image thumbnail, Title ID, Title Name (with synopsis preview), TX Date, Episode Count, Status badges (Assets/Opportunities), and View action
- **Clickable rows**: Entire row is clickable to navigate to detail page
- **Sortable**: Sort by A→Z, Most Episodes, TX Date (Newest/Oldest), or Recently Added
- **Pagination**: Navigate through pages with configurable page size (20, 30, 40, or 50 per page)
- **Filterable**: Toggle "Has Assets" and "Has Opportunities" filters
- **Scalable**: Table layout handles hundreds of titles efficiently with server-side pagination

The table shows top-line information at a glance, making it easy to scan and find specific titles before drilling into details.

## Publishing to Sales Website

The app includes role-based publishing functionality:

### Roles with Publish Permissions
- **Admin** - Can publish/unpublish titles
- **Marketing** - Can publish/unpublish titles

### Roles with View-Only Access
- **Sales** - Can see published status and sales URLs
- **Viewer** - Can see published status and sales URLs

### Features
- **Publish Control**: Marketing and Admin roles see a "Publishing" section on title detail pages with Publish/Unpublish buttons
- **Published Status**: All roles can see if a title is published, when it was published, who published it, and the sales URL
- **Table Indicator**: The browse table shows a "✓ Published" badge for published titles
- **Sales URLs**: Automatically generated in format `https://sales.example.com/titles/{title-slug}`

Published status is stored in `server/data/published.json` and persists across server restarts.
