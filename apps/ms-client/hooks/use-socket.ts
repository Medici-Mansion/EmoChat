'use client'
import { SocketContext } from '@/components/providers/socket-provier'
import { USER_UNIQUE_KEY } from '@/constants'
import { RoomInfo } from '@/socket'
import { User } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { useContext } from 'react'
import { SocketClient } from 'socket.io-client'

interface useSocketProps {
  nsp: string
  onConnect?: (socket: SocketClient) => void
  onUnmounted?: (socket: SocketClient) => void
  onMounted?: (socket: SocketClient) => void
  onRoomChanged?: (rooms: RoomInfo[]) => void
  onUserUpdated?: (user: User) => void
}

const useSocket = ({
  nsp,
  onConnect,
  onUnmounted,
  onMounted,
  onRoomChanged,
  onUserUpdated,
}: useSocketProps) => {
  const { manager } = useContext(SocketContext) || {}
  if (!manager) {
    throw new Error('Provier is not founded.')
  }

  const [isError, setIsError] = useState<string | null>(null)
  const socket = useRef(manager.create_socket(nsp)).current

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
      socket.on('connect', () => {
        socket.emit(
          'USER_JOIN',
          localStorage.getItem(USER_UNIQUE_KEY),
          (user) => {
            localStorage.setItem(USER_UNIQUE_KEY, user.id)
            if (user) {
              onUserUpdated && onUserUpdated(user)
            }
          },
        )
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
      socket.listen('disconnect', () => {
        console.log('HOOK DISCONNECTED')
      })
    }

    return () => {
      socket.off('connect')
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
