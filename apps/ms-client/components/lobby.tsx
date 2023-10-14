'use client'
import CreateRoomForm from '@/components/create-room-form'
import Header from '@/components/header'
import { SocketContext } from '@/components/providers/socket-provier'
import { Button } from '@/components/ui/button'
import { USER_UNIQUE_KEY } from '@/constants'
import useSocket from '@/hooks/use-socket'
import { cn } from '@/lib/utils'
import { Room } from '@/socket'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useContext, useState } from 'react'
import { useForm } from 'react-hook-form'

interface UserSettingParams {
  nickname: string
}

const LobbyScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const { handleSubmit, register, setValue } = useForm<UserSettingParams>()
  const router = useRouter()
  const { setInfo } = useContext(SocketContext)
  const { socket } = useSocket({
    nsp: '/',
    onConnect(socket) {
      socket.emit(
        'USER_JOIN',
        localStorage.getItem(USER_UNIQUE_KEY),
        // TYPE_ALIAS : user => UserModel
        (user: any) => {
          localStorage.setItem(USER_UNIQUE_KEY, user.id)
          if (user.nickname) {
            setNickname(user.nickname)
          }
        },
      )
    },
    onRoomChanged(rooms) {
      console.log(rooms)
      setRooms(rooms)
    },
  })
  const onValid = (data: UserSettingParams) => {
    // TYPE_ALIAS : data => client.data
    socket.emit('USER_SETTING', data, (data: UserSettingParams) => {
      setNickname(data.nickname)
    })
  }

  const setNickname = useCallback(
    (nickname: string) => {
      setInfo?.({ id: socket.id, nickname: nickname })
      setValue('nickname', nickname)
    },
    [setInfo, setValue, socket.id],
  )

  const onJoinRoom = (roomName: string) => {
    router.push(`/chat/${roomName}`)
  }
  return (
    <div
      className={cn('flex flex-col')}
      // style={{ fontFamily: 'var(--font-16)' }}
    >
      <Header />
      LOBBY 한글은?
      <Link href="/chat/room123">GO</Link>
      <form onSubmit={handleSubmit(onValid)}>
        <input
          type="text"
          {...register('nickname', { required: '닉네임은 필수입니다.' })}
        />
        <button type="submit">설정하기</button>
      </form>
      <CreateRoomForm
        onSubmit={(roomInfo) => {
          onJoinRoom(roomInfo.roomName)
        }}
      />
      {rooms.map((room) => (
        <Button key={room.name} onClick={() => onJoinRoom(room.name)}>
          {room.name} / {room.count}
        </Button>
      ))}
    </div>
  )
}

export default LobbyScreen
