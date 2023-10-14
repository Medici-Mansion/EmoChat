import { PropsWithChildren, ReactNode } from 'react'

interface ParallelRoutes {
  chat: ReactNode
}

const RootLayout = ({ children, chat }: PropsWithChildren<ParallelRoutes>) => {
  return (
    <div className="h-[100dvh] sm:h-screen">
      <main className="flex divide-x-2 h-full">
        <section className="hidden sm:block">{children}</section>
        {chat && <section className="flex-grow">{chat}</section>}
      </main>
    </div>
  )
}

export default RootLayout
