import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LifTee - Your Personal Fitness & Nutrition Companion',
  description: 'Track workouts, log nutrition, follow programs offline-first',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LifTee',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon192.png" />
        <meta name="theme-color" content="#0d0918" />
        <meta name="description" content="LifTee - Fitness & Nutrition PWA" />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/service-worker.js').catch(err => console.log('SW registration failed:', err));
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
