import Image from 'next/image'

import React from 'react'

const ChatPage = () => {
  return (
    <div className="relative h-full">
      <Image src="/images/empty.png" alt="empty" fill />
    </div>
  )
}

export default ChatPage
