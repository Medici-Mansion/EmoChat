'use client'

import { Manager } from '@/lib/Manager'
import { RoomInfoUser } from '@/socket'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from 'react'

export const SocketContext = createContext<{
  info: RoomInfoUser['user'] | null
  manager: Manager
  setInfo: Dispatch<SetStateAction<RoomInfoUser['user'] | null>> | null
}>({
  manager: new Manager(process.env.NEXT_PUBLIC_SITE_URL, {
    transports: ['websocket'],
    autoConnect: false,
  }),
  info: null,
  setInfo: null,
})

const SocketProvider = ({ children }: PropsWithChildren) => {
  const manager = useRef(
    new Manager(process.env.NEXT_PUBLIC_SITE_URL, {
      transports: ['websocket'],
    }),
  ).current

  const [info, setInfo] = useState<RoomInfoUser['user'] | null>(null)
  return (
    <SocketContext.Provider value={{ manager, info, setInfo }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider
