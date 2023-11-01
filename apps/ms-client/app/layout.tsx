import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import SocketProvider from '@/components/providers/socket-provier'
import { cn } from '@/lib/utils'

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
      <body className={cn('overflow-hidden')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="discord-theme"
        >
          <SocketProvider>
            <QueryProvider>{children}</QueryProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
