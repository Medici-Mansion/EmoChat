'use client'
import CreateRoomForm from '@/components/create-room-form'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import Popup from '@/components/ui/popup'
import { USER_UNIQUE_KEY } from '@/constants'
import useSocket from '@/hooks/use-socket'
import { Room } from '@/socket'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface UserSettingParams {
  nickname: string
}

const LobbyScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const { handleSubmit, register, setValue } = useForm<UserSettingParams>()
  const router = useRouter()
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
            setValue('nickname', user.nickname)
          }
        },
      )
    },
    onRoomChanged(rooms) {
      setRooms(() => rooms)
    },
  })
  const onValid = (data: UserSettingParams) => {
    // TYPE_ALIAS : data => client.data
    socket.emit('USER_SETTING', data, (data: UserSettingParams) => {
      setValue('nickname', data.nickname)
    })
  }

  const onJoinRoom = (roomName: string) => {
    socket.emit('JOIN_ROOM', roomName)
    router.push(`/chat/${roomName}`)
  }
  return (
    <div className="flex flex-col">
      <Header />
      LOBBY
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
        <Button key={room} onClick={() => onJoinRoom(room)}>
          {room}
        </Button>
      ))}
    </div>
  )
}

export default LobbyScreen
