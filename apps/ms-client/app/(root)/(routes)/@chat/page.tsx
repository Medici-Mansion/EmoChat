import Header from '@/components/header'
import Link from 'next/link'
import React from 'react'

const ChatPage = () => {
  return (
    <div>
      <Header />
      CHAT
      <Link href="/chat/e12321">GO</Link>
    </div>
  )
}

export default ChatPage
