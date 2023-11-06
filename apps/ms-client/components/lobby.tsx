'use client'
import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { constant } from '@emochat/interface'
import { Users } from 'lucide-react'
import Link from 'next/link'
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
        'flex flex-col w-full overflow-y-scroll',
        'h-[calc(100dvh-var(--header-height))]',
      )}
    >
      <div className="w-full bg-chatground/70 py-8 flex justify-center items-center text-chatbox-me-box text-2xl">
        Group List
      </div>
      <div className="flex flex-col divide-y-[1px]">
        {rooms.map(({ roomId, roomName }) => (
          <div
            className="grid grid-cols-[0.7fr_0.3fr_minmax(min-content,0.3fr)_1fr] py-5 items-center"
            key={roomId}
          >
            <h3 className="text-center text-xl font-semibold pl-4">
              {roomName}
            </h3>
            <div className="flex space-x-2 text-gray-400">
              <Users />
              <span>
                {
                  constant.roomGroupInfo[
                    roomId as keyof typeof constant.roomGroupInfo
                  ].count
                }
              </span>
            </div>
            <div className="text-gray-400">
              {
                constant.roomGroupInfo[
                  roomId as keyof typeof constant.roomGroupInfo
                ].title
              }
            </div>
            <div className="flex justify-center items-center">
              <Link
                className="border rounded-lg px-7 h-[44px] flex items-center border-primary text-primary hover:bg-accent"
                href={`/chat/${roomId}`}
              >
                입장
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LobbyScreen
