'use client'
import * as faceapi from 'face-api.js'
import ChatBox from '@/components/chat-box'
import { Input } from '@/components/ui/input'
import useSocket from '@/hooks/use-socket'
import { Send, Users } from 'lucide-react'
import React, { useCallback, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ReservedMessage } from '@/socket'
import { Sentiment } from '@/types'
import SentimentsRadio from '@/components/sentiments-radio'
import FaceDetector from '@/components/face-detector'
import RoomCard from '@/components/room-card'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeInOutMotion } from '@/motions'

interface RoomFormValue {
  message: string
  sentiment?: Sentiment['id']
}

interface Message extends ReservedMessage {
  createdAt: Date
}

const RoomPage = ({ params: { roomName } }: any) => {
  const [messages, setMessage] = useState<Message[]>([])
  const [sentiments, setSentiments] = useState<Sentiment[]>([])
  const [isEdit, setIsEdit] = useState(false)

  const form = useForm<RoomFormValue>()
  const chatScroller = useRef<HTMLDivElement>(null)
  const emotionRef = useRef<{
    emotion: string
    others?: faceapi.FaceExpressions
  }>({
    emotion: 'neutral',
  })

  const [users, setUsers] = useState<string[]>([])

  const { socket } = useSocket({
    nsp: '/',
    onMounted(socket) {
      socket.emit('JOIN_ROOM', roomName)
      socket.listen('WELCOME', ({ id, nickname, roomName }) => {
        // setMessage((prev) => [
        //   ...prev,
        //   {
        //     createdAt: new Date(),
        //     id,
        //     message: `${nickname} 님이 입장하였습니다.`,
        //     nickname,
        //   },
        // ])
      })

      socket.listen('RESERVE_MESSAGE', (sender) => {
        setMessage((prev) => [...prev, { ...sender, createdAt: new Date() }])
        requestIdleCallback(() => {
          if (chatScroller?.current) {
            const messageBoxHeight =
              chatScroller.current.children[0].clientHeight
            chatScroller.current.scrollTo({
              top: messageBoxHeight,
            })
          }
        })
      })
    },
    onUnmounted(socket) {
      socket.emit('EXIT_ROOM')
    },
    onRoomChanged(rooms) {
      setUsers(rooms.find((room) => room.name === roomName)?.users || [])
    },
  })

  const onSubmit = useCallback(
    async ({ message, sentiment }: RoomFormValue) => {
      const { emotion = 'neutral', others } = emotionRef.current
      socket.emit('SEND_MESSAGE', {
        message,
        emotion,
        sentiment: sentiment,
        others,
      })
      form.resetField('message')
    },
    [form, socket],
  )

  return (
    <>
      <div className="p-3 py-4 hidden sm:block">
        <RoomCard roomName={roomName} />
        <div className="flex flex-col space-y-2 mt-2">
          <AnimatePresence mode="popLayout">
            {users.map((user, index) => (
              <motion.div
                {...fadeInOutMotion}
                key={user + index}
                className="flex items-center space-x-2"
              >
                <Users />
                <p>{user}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div
        ref={chatScroller}
        className="relative grow h-screen overflow-y-scroll bg-chatground"
      >
        <div className="min-h-[calc(100%-52px-48px)] mt-4 pb-[52px]">
          {messages.map(({ id, message, nickname, createdAt, font }, index) => (
            <ChatBox
              sender={nickname}
              font={font}
              content={message}
              createdAt={createdAt}
              isMe={id === socket.id}
              key={id + index + createdAt}
            />
          ))}
        </div>

        <form
          className="sticky bottom-[48px]"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            control={form.control}
            name="sentiment"
            render={({ field }) => (
              <div className="flex justify-around py-2">
                <SentimentsRadio
                  sentiments={sentiments}
                  onValueChange={(sentiment) => {
                    field.onChange(sentiment.id)
                  }}
                />
              </div>
            )}
          />
          <div className="relative  p-2 px-4 bg-transparent">
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
        batchRunning={!isEdit}
        onEmotionChange={(emotion) => {
          console.log(emotion)
          emotionRef.current = emotion
          socket.emit(
            'GET_SENTIMENTS',
            emotionRef.current.emotion,
            (sentiments: Sentiment[]) => {
              if (emotionRef.current.emotion === 'neutral') {
                form.resetField('sentiment')
              }
              setSentiments(sentiments)
            },
          )
        }}
      />
    </>
  )
}

export default RoomPage
