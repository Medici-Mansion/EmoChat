'use client'
import * as faceapi from 'face-api.js'
import { Send, Users } from 'lucide-react'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'

import { ReservedMessage, RoomInfo, RoomInfoUser } from '@/socket'
import { Emotion, Sentiment, User, WithParam } from '@/types'
import { fadeInOutMotion } from '@/motions'

import useSocket from '@/hooks/use-socket'

import ChatBox from '@/components/chat-box'
import { Input } from '@/components/ui/input'
import SentimentsRadio from '@/components/sentiments-radio'
import FaceDetector from '@/components/face-detector'
import RoomSetting from '@/components/room-setting'
import DefaultAvatar from '@/components/default-avatar'
import { SocketContext } from '@/components/providers/socket-provier'
import AnimatedRefresh from '@/components/animate-refresh'
import { USER_UNIQUE_KEY } from '@/constants'

interface RoomFormValue {
  message: string
  sentiment?: Sentiment['id']
}

interface Message extends ReservedMessage {
  createdAt: Date
}

const RoomPage = ({
  params: { roomName: encodedRoomName },
}: WithParam<'roomName'>) => {
  const { info } = useContext(SocketContext)
  const [messages, setMessage] = useState<Message[]>([])
  const [sentiments, setSentiments] = useState<Sentiment[]>([])
  const [isEdit, setIsEdit] = useState(false)
  const form = useForm<RoomFormValue>()

  const chatScroller = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const emotionRef = useRef<{
    emotion: string
    others?: faceapi.FaceExpressions
  }>({
    emotion: 'neutral',
  })

  const [roomInfo, setRoomInfo] = useState<RoomInfo>()
  const [users, setUsers] = useState<RoomInfoUser[]>([])
  const roomName = useMemo(
    () => decodeURIComponent(encodedRoomName),
    [encodedRoomName],
  )

  const { socket } = useSocket({
    nsp: '/',
    onConnect() {
      socket.emit('JOIN_ROOM', roomName, (users) => {
        setUsers(users)
      })
      socket.listen(`USERS:${roomName}`, (users) => {
        setUsers(users)
      })
    },
    onMounted(socket) {
      socket.listen(`ROOM:${roomName}`, (sender) => {
        setMessage((prev) => [...prev, { ...sender, createdAt: new Date() }])
        requestIdleCallback(() => {
          if (chatScroller?.current) {
            const messageBoxHeight = chatScroller.current.scrollHeight
            chatScroller.current.scrollTo({
              top: messageBoxHeight,
            })
          }
        })
      })
    },
    onRoomChanged(rooms) {
      if (rooms?.length) {
        const newRoomInfo = rooms.find((room) => room.id === roomName)
        if (newRoomInfo) {
          setRoomInfo(() => newRoomInfo)
        }
      }
    },
  })

  const usersMap = useMemo(() => {
    const newUserMap: { [key in string]: User } = {}
    users.forEach(({ user }) => {
      if (user?.id) {
        newUserMap[user.id] = user
      }
    })
    return newUserMap
  }, [users])

  const onSubmit = useCallback(
    async ({ message, sentiment }: RoomFormValue) => {
      const { emotion = 'neutral', others } = emotionRef.current
      socket.emit('SEND_MESSAGE', {
        roomId: roomName,
        userId: info?.id || localStorage.getItem(USER_UNIQUE_KEY) || '',
        message,
        emotion,
        sentiment: sentiment,
        others,
      })
      form.resetField('message')
    },
    [form, info?.id, roomName, socket],
  )

  const handleScroll = () => {
    clearTimeout(timeoutRef.current)
    const elevationDom = document.querySelector('div.elevation-t')
    elevationDom?.classList.add('scrolling')
    timeoutRef.current = setTimeout(() => {
      elevationDom?.classList.remove('scrolling')
    }, 1000)
  }

  const onEmotionChange = useCallback(
    (emotion: Emotion) => {
      emotionRef.current = emotion
      socket.emit(
        'GET_SENTIMENTS',
        emotionRef.current.emotion,
        (sentiments) => {
          if (emotionRef.current.emotion === 'neutral') {
            form.resetField('sentiment')
          }
          setSentiments(sentiments)
        },
      )
    },
    [form, socket],
  )

  useEffect(() => {
    socket.emit('JOIN_ROOM', roomName, (users) => {
      setUsers(users)
    })
    const ref = chatScroller.current
    if (ref) {
      ref.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll)
      }
      socket.emit('EXIT_ROOM')
      socket.off(`USERS:${roomName}`)
    }
  }, [roomName, socket])
  return (
    <>
      <div className="p-3 py-2 hidden sm:block">
        <div className="pt-6">
          <AnimatePresence mode="popLayout">
            {Object.keys(usersMap).map((userId) => {
              return (
                <motion.div
                  {...fadeInOutMotion}
                  key={userId}
                  className="flex items-center space-x-2 pl-9 text-ellipsis overflow-hidden max-w-[80%] "
                >
                  {usersMap[userId].isDefaultAvatar ? (
                    <DefaultAvatar avatar={usersMap[userId].avatar} />
                  ) : (
                    ''
                  )}
                  <p className="opacity-60">{usersMap[userId].nickname}</p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
      <div className="relative grow h-[calc(100dvh-var(--header-height))] bg-chatground flex flex-col overflow-clip">
        <div
          ref={chatScroller}
          className="grow overflow-y-scroll scrollbar-hide"
        >
          <div className="py-8 px-9 flex items-center backdrop-blur-lg h-10 sticky bg-background/70 top-0 z-10">
            <h2 className="text-2xl mr-12 font-extrabold">
              {roomInfo?.roomName || '방이름 불러오는 중..'}
            </h2>
            <p className="flex items-center space-x-2 grow opacity-70">
              <Users size={14} />
              <span className="text-md">{users.length || 0}</span>
            </p>
            <div className="grow flex justify-end space-x-4">
              <AnimatedRefresh
                className="sm:hidden shadow-none flex items-center border-none hover:bg-transparent bg-transparent"
                onClick={() => {
                  onEmotionChange({
                    emotion: 'neutral',
                  })
                }}
              />
              <RoomSetting
                roomName={roomInfo?.roomName}
                onSubmit={(data) => {
                  socket.emit('ROOM_SETTING', data)
                }}
              />
            </div>
          </div>
          {messages.map(
            ({ id, userId, message, createdAt, font, user }, index) => (
              <ChatBox
                sender={user}
                font={font}
                content={message}
                createdAt={createdAt}
                isMe={userId === info?.id}
                key={id + index + createdAt}
              />
            ),
          )}
        </div>

        <form
          className="bg-chatground relative pb-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            control={form.control}
            name="sentiment"
            render={({ field }) => (
              <div className="flex justify-around py-2 w-full h-fit elevation-t relative duration-300">
                <SentimentsRadio
                  sentiments={sentiments}
                  onValueChange={(sentiment) => {
                    field.onChange(sentiment.id)
                  }}
                />
              </div>
            )}
          />
          <div className="relative px-4 py-2  bg-transparent">
            <Input
              autoComplete="off"
              onFocus={() => {
                setIsEdit(true)
              }}
              className="pr-10 bg-chatbox-others-box"
              {...form.register('message', {
                onChange(event) {
                  if (event.target.value.length <= 0) {
                    isEdit && setIsEdit(false)
                  } else {
                    !isEdit && setIsEdit(true)
                  }
                },
                onBlur() {
                  if (form.getValues().message.length <= 0) {
                    setIsEdit(false)
                  }
                },
                required: 'Message is required.',
              })}
            />
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 hover:cursor-pointer"
              type="submit"
            >
              <Send />
            </button>
          </div>
        </form>
      </div>
      <FaceDetector
        header={
          info?.isDefaultAvatar ? (
            <div className="flex items-center space-x-2 py-2 text-ellipsis overflow-hidden max-w-[80%]">
              <DefaultAvatar avatar={info.avatar} />
              <p className="opacity-60">{info.nickname}</p>
            </div>
          ) : (
            ''
          )
        }
        batchRunning={!isEdit}
        onEmotionChange={onEmotionChange}
      />
    </>
  )
}

export default RoomPage
