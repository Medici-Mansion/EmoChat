'use client'

import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import RoomCard from './room-card'
import Link from 'next/link'
import { AVATAR_COLORS } from '@/constants'

const LobbyScreen = () => {
  useSocket({
    nsp: '/',
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
      {RoomNames.map(({ code, color }, index) => (
        <Link
          href={`/chat/${String.fromCharCode(code)}`}
          key={code + '' + color}
        >
          <RoomCard roomName={String.fromCharCode(code)} />
        </Link>
      ))}
    </div>
  )
}

export default LobbyScreen
