import type { Metadata } from 'next'
import './globals.css'
import LenisProvider from '@/components/LenisProvider'

export const metadata: Metadata = {
  title: 'Free - Work from anywhere jobs',
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
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://be-free.vercel.app',
    siteName: 'Free',
    title: 'Free - Work from anywhere jobs',
    description: 'Discover freelance jobs, track your contracts, and manage your time all in one place',
    images: [
      {
        url: 'https://be-free.vercel.app/og-image.png',
        width: 1120,
        height: 560,
        alt: 'Free - Work from anywhere',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free - Work from anywhere jobs',
    description: 'Discover freelance jobs, track your contracts, and manage your time',
    images: ['https://be-free.vercel.app/og-image.png'],
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0f0d0a" />
      </head>
      <body className="bg-dark text-cream font-serif">
        <LenisProvider />
        {children}
      </body>
    </html>
  )
}
