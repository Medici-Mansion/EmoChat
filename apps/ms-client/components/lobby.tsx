'use client'

import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import RoomCard from './room-card'

const LobbyScreen = () => {
  const [rooms, setRooms] = useState<{ roomId: string; roomName: string }[]>([])
  useSocket({
    nsp: '/',
    onRoomChanged(newRooms) {
      setRooms(() => newRooms)
    },
  })

  return (
    <div
      className={cn(
        'flex flex-col sm:grid sm:grid-cols-2 gap-y-6 gap-x-8 h-fit',
      )}
    >
      {rooms.map(({ roomId, roomName }) => (
        <RoomCard roomName={roomName} roomId={roomId} key={roomId} />
      ))}
    </div>
  )
}

export default LobbyScreen
