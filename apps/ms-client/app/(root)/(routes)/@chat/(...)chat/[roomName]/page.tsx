'use client'

import useSocket from '@/hooks/use-socket'
import React, { useEffect } from 'react'

const RoomPage = ({ params: { roomName } }: any) => {
  const { socket } = useSocket({
    nsp: '/',
    onConnect(socket) {
      socket.listen('WELCOME', (message) => {
        console.log('WELCOME', message)
      })
    },
  })

  return <div>page {roomName} </div>
}

export default RoomPage
