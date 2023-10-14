import Header from '@/components/header'
import { PropsWithChildren, ReactNode } from 'react'

interface ParallelRoutes {
  chat: ReactNode
}

const RootLayout = ({ children, chat }: PropsWithChildren<ParallelRoutes>) => {
  return (
    <div className="h-[100dvh] sm:h-screen">
      <Header />
      <main className="flex divide-x-2 h-full">
        <section className="hidden sm:block flex-[1]">{children}</section>
        {chat && <section className="flex-[4]">{chat}</section>}
      </main>
    </div>
  )
}

export default RootLayout
