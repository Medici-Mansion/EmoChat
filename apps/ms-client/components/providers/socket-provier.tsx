'use client'

import { Manager } from '@/libs/Manager'
import { createContext, FC, ReactNode } from 'react'
import { Socket } from 'socket.io-client'

export const manager = new Manager(process.env.NEXT_PUBLIC_SITE_URL, {
  transports: ['websocket'],
  multiplex: true,
})

export const SocketContext = createContext<{
  socket: Socket | null
  manager: Manager
}>({
  socket: null,
  manager,
})
const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket: null, manager }}>
      {children}
    </SocketContext.Provider>
  )
}
export default SocketProvider
