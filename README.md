# Free - A Simple Freelance Job Board

A minimal, modern web application for freelancers to discover job opportunities, manage contracts, and track billable hours all in one place.

**Live Demo:** [https://freelancer-app-gamma.vercel.app](https://freelancer-app-gamma.vercel.app)

## Features

### Jobs Board
- Browse real freelance job listings from top tech companies
- Search and filter jobs by title, company, location, and type
- View accurate salary ranges for each position
- Direct links to job applications
- Last updated timestamp for freshness
- One-click refresh for latest opportunities

### Contract Management
- Create and manage freelance contracts
- Track freelancer and client information
- Set hourly rates and contract dates
- Quick delete with confirmation
- Persistent storage via localStorage

### Time Tracking
- Real-time timer for billable work
- Log time entries with duration
- Associate entries with specific contracts
- View time history and totals
- Calculate weekly time metrics

### Dashboard
- Overview of active contracts
- Total time tracked for the week
- Quick access to all features
- Clean, distraction-free interface

### Navigation
- Bottom navbar on mobile for thumb-friendly navigation
- Vertical sidebar on desktop
- Animated active state indicators
- Smooth page transitions

## Tech Stack

- **Framework:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS v4 with custom variables
- **Animations:** Framer Motion
- **Icons:** Radix UI Icons
- **Storage:** Browser localStorage
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/asl677/Contract-App.git
cd freelancer-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
freelancer-app/
├── app/
│   ├── page.tsx           # Main app container with state management
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles and CSS variables
│   └── api/
│       └── jobs/
│           └── route.ts   # Real job listings API
├── components/
│   ├── Navigation.tsx     # Main navigation bar/sidebar
│   ├── CreateContractPanel.tsx # Contract creation form
│   ├── Toast.tsx          # Toast notification system
│   └── pages/
│       ├── Jobs.tsx       # Job board interface
│       ├── Contracts.tsx  # Contract list and management
│       ├── TimeTracking.tsx # Time tracking interface
│       ├── Dashboard.tsx   # Dashboard overview
│       ├── Settings.tsx    # App settings
│       └── JobDetail.tsx   # Job detail view
├── public/
│   ├── favicon.svg
│   ├── apple-touch-icon.svg
│   └── og-image.svg
└── package.json
```

## Design System

### Colors
- **Dark:** #0f0d0a (primary background)
- **Cream:** #ede0c8 (primary text)
- **Mint:** #7ee7b8 (accent)
- **Coral:** #d9704d (highlights)
- **Surface:** #1a1815 (secondary background)

### Typography
- **Serif:** EB Garamond (body, messages, headings)
- **Mono:** DM Mono (data, time, code)
- **Sans:** Space Grotesk (labels)

### Spacing
- 8px grid system
- Consistent gaps and padding throughout

## Features Detail

### Jobs Page
The jobs page displays real freelance opportunities with:
- Job title and company
- Salary ranges (formatted as ranges, e.g., "180K-250K")
- Location information
- Job type classification (Product/Design)
- Direct links to job applications
- Updated timestamp showing when data was last refreshed
- Search functionality to filter by title and company
- Type and location filters
- Mobile-optimized responsive design

### Contract Management
Create contracts with:
- Freelancer name (your name)
- Client name
- Hourly rate
- Start and end dates
- Active status tracking

Contracts are saved to localStorage for persistence.

### Time Tracking
Track hours worked with:
- Real-time stopwatch timer
- Manual duration entry
- Contract association
- Entry history with timestamps
- Weekly total calculations
- Time display in HH:MM:SS format

## Responsive Design

The app is fully responsive with optimized layouts for:
- **Mobile:** 375px - 767px (bottom navigation, single column)
- **Tablet:** 768px - 1023px (sidebar, stacked layouts)
- **Desktop:** 1024px+ (full navigation, multi-column)

## Performance

- Optimized with Next.js Turbopack
- Static generation for fast page loads
- Efficient component rendering with memoization
- Smooth animations using GPU acceleration
- Minimal bundle size with selective imports

## Deployment

The app is deployed on Vercel with:
- Automatic builds on git push
- Production environment at: https://freelancer-app-gamma.vercel.app
- Zero-config deployment
- Edge caching for assets

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential features for future versions:
- User authentication
- Cloud sync across devices
- Invoice generation
- Analytics and reporting
- Payment integration
- Multi-user teams
- Export to CSV/PDF

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with focus on simplicity and usability. Free to use, open to suggestions.