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

  if (typeof window === 'undefined') {
    throw new Error("This hook can't use on server-side.")
  }
  const [isError, setIsError] = useState<string | null>(null)
  const socket = useRef(manager.create_socket(nsp)).current

  useEffect(() => {
    if (socket) {
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
      socket.on('ROOM_CHANGE', (rooms) => {
        if (isError) {
          setIsError(null)
        }
        onRoomChanged && onRoomChanged(rooms)
      })
    }
  }, [isError, onConnect, onRoomChanged, socket])
  useEffect(() => {
    if (socket) {
      onMounted && onMounted(socket)
    }
    return () => {
      onUnmounted && onUnmounted(socket)
    }
  }, [socket])
  return {
    manager,
    socket: socket,
    isError,
    isConnected: socket.connected,
    isLoading: !socket,
  }
}

export default useSocket
