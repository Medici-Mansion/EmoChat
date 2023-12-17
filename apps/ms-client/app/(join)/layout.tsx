import Empty from '@/components/Empty'
import React, { PropsWithChildren } from 'react'
import { cookies } from 'next/headers'
import { USER_UNIQUE_KEY } from '@/constants'
import { checkUser } from '@/lib/utils'
import { redirect } from 'next/navigation'

const JoinLayout = async ({ children }: PropsWithChildren) => {
  const userId = cookies().get(USER_UNIQUE_KEY)?.value
  if (userId) {
    const user = await checkUser(userId)
    if (user) {
      return redirect('/chat/9f8bbd24-9d98-4580-927f-15168791c121')
    }
  }
  return (
    <div className="h-[100dvh] sm:h-screen">
      <main className="flex divide-x-2 h-full">
        <section className="flex-[1] pc-main-grid">
          <Empty />
          {children}
          <Empty />
        </section>
      </main>
    </div>
  )
}

export default JoinLayout
