'use client'

import { Manager } from '@/lib/Manager'
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from 'react'
import { Socket } from 'socket.io-client'

export const SocketContext = createContext<{
  socket: Socket | null
  manager: Manager
} | null>(null)

const SocketProvider = ({ children }: PropsWithChildren) => {
  const manager = useRef(
    new Manager(process.env.NEXT_PUBLIC_SITE_URL, {
      transports: ['websocket'],
    }),
  ).current
  return (
    <SocketContext.Provider value={{ manager, socket: null }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider
