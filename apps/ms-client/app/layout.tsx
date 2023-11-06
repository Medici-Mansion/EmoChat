import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import SocketProvider from '@/components/providers/socket-provier'
import SplashScreen from '@/components/splash-screen'

export const metadata: Metadata = {
  title: 'EmoChat',
  description: 'Send messages with your emotion!',
  viewport: {
    userScalable: false,
    initialScale: 1,
    maximumScale: 1,
    width: 'device-width',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="emochat-theme"
        >
          <SocketProvider>
            <QueryProvider>
              {children}
              <SplashScreen />
            </QueryProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
