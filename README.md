# Free App

A freelancer dashboard for discovering remote jobs, managing contracts, and tracking billable hours.

## Features

**Jobs Board**
- Search and filter real job listings
- Filter by job type, location, salary range, and source
- One-click refresh for latest opportunities

**Contract Management**
- Create and manage contracts
- Track client, rate, and contract dates
- Export time tracking data to CSV

**Time Tracking**
- Real-time timer for billable work
- Log time entries with contract associations
- View total hours and earnings

**Dashboard**
- Quick overview of active contracts
- Recent time entries
- Total earnings and time tracked

## Tech Stack

- **Framework:** Next.js 16 + TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Radix UI Icons
- **Storage:** localStorage
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
git clone https://github.com/asl677/free-app.git
cd free-app

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
free-app/
├── app/
│   ├── page.tsx           # Main app container
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/jobs/          # Job listings API
├── components/
│   ├── Navigation.tsx     # Nav bar/sidebar
│   ├── FilterPanel.tsx    # Job filters
│   ├── Toast.tsx          # Notifications
│   └── pages/
│       ├── Jobs.tsx       # Job board
│       ├── Contracts.tsx  # Contract management
│       ├── TimeTracking.tsx
│       ├── Dashboard.tsx
│       ├── Settings.tsx
│       └── Notes.tsx
└── package.json
```

## Design

**Colors**
- Dark background: #0f0d0a
- Light text: #ede0c8
- Accent (mint): #7dd3c0
- Highlight (coral): #d9704d

**Typography**
- Body/Headings: EB Garamond (serif)
- Code/Data: DM Mono (monospace)

**Responsive**
- Mobile: Single column, bottom nav
- Desktop: Sidebar + content

## Deployment

Live at [https://be-free.vercel.app](https://be-free.vercel.app)

Deployed automatically on git push to main via Vercel.

## License

MIT
