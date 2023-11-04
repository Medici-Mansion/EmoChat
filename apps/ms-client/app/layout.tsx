import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import SocketProvider from '@/components/providers/socket-provier'
import SplashScreen from '@/components/splash-screen'

export const metadata: Metadata = {
  title: 'MS Messenger',
  description: 'Send messages with your emotion!',
  viewport: {
    userScalable: false,
    initialScale: 1,
    maximumScale: 1,
    width: 'device-width',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
