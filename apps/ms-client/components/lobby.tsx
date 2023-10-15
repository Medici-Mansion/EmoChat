'use client'
import { Button } from '@/components/ui/button'
import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { Room } from '@/socket'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import RoomCard from './room-card'
import Link from 'next/link'

const LobbyScreen = () => {
  useSocket({
    nsp: '/',
  })

  const colors = useMemo(
    () => [
      '#EF8482',
      '#FFD762',
      '#EC609C',
      '#FFA31D',
      '#00F0A5',
      '#F5C3AF',
      '#EA89D7',
      '#64A2FF',
      '#913DF3',
      '#564CFF',
    ],
    [],
  )
  const RoomNames = useMemo(
    () =>
      colors.map((color, index) => {
        return { code: index + 65, color }
      }),
    [colors],
  )

  return (
    <div className={cn('flex flex-col sm:grid sm:grid-cols-2 gap-y-6 gap-x-8')}>
      {RoomNames.map(({ code, color }, index) => (
        <Link
          href={`/chat/${String.fromCharCode(code)}`}
          key={code + '' + index}
        >
          <RoomCard roomName={String.fromCharCode(code)} />
        </Link>
      ))}
    </div>
  )
}

export default LobbyScreen
