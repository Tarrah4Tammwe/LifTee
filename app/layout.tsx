import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'US Visa Overstay Calculator — Check Your Ban Risk | OverstayCheck',
  description: 'Enter your I-94 expiry date and find out instantly if you face a 3-year or 10-year US re-entry ban. Plain English. No jargon.',
  keywords: ['visa overstay calculator', 'US visa overstay', 'I-94 overstay', '3 year ban', '10 year ban', 'unlawful presence', 'immigration calculator'],
  openGraph: {
    title: 'US Visa Overstay Calculator — Check Your Ban Risk',
    description: 'Find out instantly if you face a 3-year or 10-year US re-entry ban. Enter your I-94 date. Plain English answer in seconds.',
    url: 'https://www.overstaycheck.com',
    siteName: 'OverstayCheck',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8935274984783226"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
