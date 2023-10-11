'use client'
import faceapi from 'face-api.js'
import useSocket from '@/hooks/use-socket'
import { useEffect } from 'react'

const MainPageClient = () => {
  const { socket } = useSocket({
    nsp: '/',
    onRoomChanged(rooms) {
      console.log(rooms)
    },
  })
  useEffect(() => {
    socket.emit('events', '123', (data: string) => {
      console.log(data)
    })
  }, [socket])
  return <div>??</div>
}

export default MainPageClient
