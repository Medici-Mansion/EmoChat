import Header from '@/components/header'
import { PropsWithChildren, ReactNode } from 'react'

interface ParallelRoutes {}

const RootLayout = ({ children }: PropsWithChildren<ParallelRoutes>) => {
  return (
    <div className="h-[100dvh] sm:h-screen overflow-hidden">
      <Header />
      <main className="flex divide-x-2 h-full">
        <section className="flex-[1] pc-main-grid">{children}</section>
      </main>
    </div>
  )
}

export default RootLayout
