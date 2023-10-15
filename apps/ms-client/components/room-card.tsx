import React from 'react'
import Face from './svg/face'
import { cn } from '@/lib/utils'

interface RoomCardProps {
  roomName: string
}

const RoomCard = ({ roomName }: RoomCardProps) => {
  return (
    <div className="flex space-x-4 items-center px-4 py-3 border-2 border-white rounded-xl min-w-fit w-full">
      <div
        className={cn('w-9 h-9 flex items-center justify-center rounded-full')}
        style={{
          backgroundColor: `var(--color-${roomName})`,
        }}
      >
        <Face className="w-[14px] h-[15px]" />
      </div>

      <h1 className="text-2xl whitespace-nowrap">Group {roomName}</h1>
    </div>
  )
}

export default RoomCard
