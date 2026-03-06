import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free - A simple freelance job board',
  description: 'Discover freelance jobs, track your contracts, and manage your time all in one place',
  applicationName: 'Free',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Free',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freelancer-app-gamma.vercel.app',
    siteName: 'Free',
    title: 'Free - A simple freelance job board',
    description: 'Discover freelance jobs, track your contracts, and manage your time all in one place',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Contract App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free - A simple freelance job board',
    description: 'Discover freelance jobs, track your contracts, and manage your time',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Free" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="theme-color" content="#0f0d0a" />
      </head>
      <body className="bg-dark text-cream font-serif">
        {children}
      </body>
    </html>
  )
}
