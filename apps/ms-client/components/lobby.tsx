'use client'
import { Button } from '@/components/ui/button'
import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { Room } from '@/socket'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeInOutReverseMotion } from '@/motions'
import { User } from 'lucide-react'

const MotionButton = motion(Button)
const LobbyScreen = () => {
  const path = usePathname()
  const title =
    path.split('/').filter((item) => item !== 'chat' && !!item)[0] || 'Lobby'
  const [rooms, setRooms] = useState<Room[]>([])

  const router = useRouter()

  useSocket({
    nsp: '/',
    onRoomChanged(rooms) {
      setRooms(rooms)
    },
  })

  const onJoinRoom = (roomName: string) => {
    router.push(`/chat/${roomName}`)
  }
  return (
    <div className={cn('flex flex-col')}>
      <AnimatePresence mode="wait">
        {rooms.map((room) => (
          <MotionButton
            variant="secondary"
            className={cn(
              'rounded-none bg-primary/20 shadow-none flex flex-col py-2 items-start h-full',
              encodeURIComponent(title) === room.name && 'bg-secondary',
            )}
            key={room.name}
            {...fadeInOutReverseMotion}
            onClick={() => onJoinRoom(room.name)}
          >
            <p className="text-2xl">{room.name}</p>
            <p className="flex items-center space-x-2">
              <User />
              <span> {room.count}</span>
            </p>
          </MotionButton>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default LobbyScreen
