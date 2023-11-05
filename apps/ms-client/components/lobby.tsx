'use client'

import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'
import RoomCard from './room-card'
import Link from 'next/link'
import { AVATAR_COLORS } from '@/constants'

const LobbyScreen = () => {
  const [rooms, setRooms] = useState<{ roomId: string; roomName: string }[]>([])
  useSocket({
    nsp: '/',
    onRoomChanged(newRooms: any) {
      console.log(newRooms)
      setRooms(() => newRooms)
    },
  })

  const RoomNames = useMemo(
    () =>
      AVATAR_COLORS.map((color, index) => {
        return { code: index + 65, color }
      }),
    [],
  )

  return (
    <div
      className={cn(
        'flex flex-col sm:grid sm:grid-cols-2 gap-y-6 gap-x-8 h-fit',
      )}
    >
      {rooms.map(({ roomId, roomName }, index) => (
        <Link href={`/chat/${roomId}`} key={roomId}>
          <RoomCard roomName={roomName} />
        </Link>
      ))}
    </div>
  )
}

export default LobbyScreen
