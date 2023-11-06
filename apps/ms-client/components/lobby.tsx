'use client'
import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Users } from 'lucide-react'
import Link from 'next/link'

// 배포환경이 Nodejs 런타임이라 Bun syntax 적용안됨. 임시데이터 추가
const roomGroupInfo = {
  '9f8bbd24-9d98-4580-927f-15168791c121': {
    name: 'Group A',
    count: 3,
    title: '가족',
  },
  '42b8fb59-c78e-49ff-bfaa-685c590e73c0': {
    name: 'Group B',
    count: 2,
    title: '가족',
  },
  'c486c072-5900-4163-8fba-ffa3350a1680': {
    name: 'Group C',
    count: 2,
    title: '연인',
  },
  '487b239c-0435-4968-a423-573655a03dbf': {
    name: 'Group D',
    count: 2,
    title: '연인',
  },
  '265a5d3b-9dcd-4441-8925-206eb66172e9': {
    name: 'Group E',
    count: 3,
    title: '친구',
  },
  'd4152886-a972-496f-8fa7-727026d466e7': {
    name: 'Group F',
    count: 2,
    title: '친구',
  },
  '764a41c1-f25d-4cc1-a752-031059e16dd9': {
    name: 'Group G',
    count: 3,
    title: '동료',
  },
  '8dbb2e02-5987-4fc2-bab0-37a61881e905': {
    name: 'Group H',
    count: 2,
    title: '동료',
  },
  'dfaca612-1b67-4157-8187-2992725d08a9': {
    name: 'Group I',
    count: 3,
    title: '새로운 사람',
  },
  '8d828608-bf68-4927-b0b9-12144053728d': {
    name: 'Group J',
    count: 2,
    title: '새로운 사람',
  },
}

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
                {roomGroupInfo[roomId as keyof typeof roomGroupInfo].count}
              </span>
            </div>
            <div className="text-gray-400">
              {roomGroupInfo[roomId as keyof typeof roomGroupInfo].title}
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
