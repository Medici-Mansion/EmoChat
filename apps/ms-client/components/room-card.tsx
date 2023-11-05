import React from 'react'
import Face from './svg/face'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface RoomCardProps {
  roomName: string
}

const RoomCard = ({ roomName }: RoomCardProps) => {
  return (
    <div className="flex space-x-1 items-center py-1 border-2 border-white rounded-xl min-w-fit w-full opacity-60">
      <Link
        href="/lobby"
        className={cn('w-9 h-9 flex items-center justify-center rounded-full')}
      >
        <ArrowLeft size={30} />
      </Link>

      <h1 className="text-2xl whitespace-nowrap">{roomName}</h1>
    </div>
  )
}

export default RoomCard
