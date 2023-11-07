'use client'

import { Manager } from '@/lib/Manager'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from 'react'

interface SocketData {
  id: string
  nickname: string
  profile: string
}

export const SocketContext = createContext<{
  info: SocketData | null
  manager: Manager
  setInfo: Dispatch<SetStateAction<SocketData | null>> | null
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

  const [info, setInfo] = useState<SocketData | null>(null)
  return (
    <SocketContext.Provider value={{ manager, info, setInfo }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider
