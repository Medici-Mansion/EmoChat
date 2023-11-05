'use client'
import { SocketContext } from '@/components/providers/socket-provier'
import { Room } from '@/socket'
import { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { Socket } from 'socket.io-client'

interface useSocketProps {
  nsp: string
  onConnect?: (socket: Socket) => void
  onUnmounted?: (socket: Socket) => void
  onMounted?: (socket: Socket) => void
  onRoomChanged?: (rooms: Room[]) => void
}

const useSocket = ({
  nsp,
  onConnect,
  onUnmounted,
  onMounted,
  onRoomChanged,
}: useSocketProps) => {
  const { manager } = useContext(SocketContext) || {}
  if (!manager) {
    throw new Error('Provier is not founded.')
  }

  const [isError, setIsError] = useState<string | null>(null)
  const socket = useRef<Socket>(manager.create_socket(nsp)).current

  useEffect(() => {
    if (socket && typeof window !== 'undefined') {
      if (!socket.connected) {
        socket.connect()
      }
      socket.listen('connect_error', ({ message }: Error) => {
        if (!isError) {
          setIsError(message)
        }
      })
      socket.listen('connect', () => {
        if (isError) {
          setIsError(null)
        }
        onConnect && onConnect(socket)
      })
      socket.listen('ROOM_CHANGE', (rooms) => {
        if (isError) {
          setIsError(null)
        }
        onRoomChanged && onRoomChanged(rooms)
      })
    }
  }, [isError, onConnect, onRoomChanged, socket])
  useEffect(() => {
    if (socket.connected) {
      onMounted && onMounted(socket)
    }
    return () => {
      onUnmounted && onUnmounted(socket)
    }
  }, [socket.connected])
  return {
    manager,
    socket: socket,
    isError,
    isConnected: socket.connected,
    isLoading: !socket,
  }
}

export default useSocket
