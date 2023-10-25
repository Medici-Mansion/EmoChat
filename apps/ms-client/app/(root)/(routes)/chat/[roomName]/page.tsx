'use client'
import * as faceapi from 'face-api.js'
import ChatBox from '@/components/chat-box'
import { Input } from '@/components/ui/input'
import useSocket from '@/hooks/use-socket'
import { Send, Users } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ReservedMessage } from '@/socket'
import { Sentiment } from '@/types'
import SentimentsRadio from '@/components/sentiments-radio'
import RoomCard from '@/components/room-card'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeInOutMotion, fadeInOutReverseMotion } from '@/motions'
const INTERVAL_TIME = 500

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

  const timer = useRef<NodeJS.Timeout>()
  const form = useForm<RoomFormValue>()
  const chatScroller = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>()
  const emotionRef = useRef<{
    emotion: string
    others?: faceapi.FaceExpressions
  }>({
    emotion: 'neutral',
  })

  const [users, setUsers] = useState<string[]>([])
  const checkCnt = useRef<number>(0)

  const { socket } = useSocket({
    nsp: '/',
    onMounted(socket) {
      socket.emit('JOIN_ROOM', roomName)
      socket.listen('WELCOME', ({ id, nickname, roomName }) => {
        setMessage((prev) => [
          ...prev,
          {
            createdAt: new Date(),
            id,
            message: `${nickname} 님이 입장하였습니다.`,
            nickname,
          },
        ])
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

  const startStream = useCallback(async () => {
    if (typeof window === 'undefined') return
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ])
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        aspectRatio: 9 / 12,
        width: 200,
        facingMode: 'environment',
      },
    })
    streamRef.current = stream
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [])

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().map((track) => {
      track.stop()
    })
  }, [])

  const getEmotion = useCallback(
    async (cnt: number) => {
      const dect = await faceapi
        .detectAllFaces(
          videoRef.current!,
          new faceapi.TinyFaceDetectorOptions(),
        )
        .withFaceLandmarks()
        .withFaceExpressions()

      if (dect?.[0]?.expressions) {
        const expres = dect?.[0]?.expressions
        let maxV = 0
        let key = ''
        Object.entries(expres).map((item) => {
          if (item[1] > maxV) {
            maxV = item[1]
            key = item[0]
          }
        })

        const { emotion } = emotionRef.current
        if (
          (emotion !== key && cnt < 10 && key !== 'neutral') ||
          (emotion !== key && cnt - checkCnt.current > 6)
        ) {
          socket.emit('GET_SENTIMENTS', key, (sentiments: Sentiment[]) => {
            if (key === 'neutral') {
              form.resetField('sentiment')
            }
            setSentiments(sentiments)
          })
          checkCnt.current = cnt
          emotionRef.current = {
            emotion: key,
            others: expres,
          }
        }
      }
    },
    [form, socket],
  )

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

  const getEmotionBatch = useCallback(() => {
    let cnt = 0
    return setInterval(async () => {
      await getEmotion(cnt)
      cnt++
    }, INTERVAL_TIME)
  }, [getEmotion])

  useEffect(() => {
    if (!isEdit) {
      clearInterval(timer.current)
      timer.current = getEmotionBatch()
    } else {
      clearInterval(timer.current)
    }
    return () => {
      clearInterval(timer.current)
    }
  }, [getEmotionBatch, isEdit])

  useEffect(() => {
    startStream()
    return () => {
      stopStream()
    }
  }, [startStream, stopStream])

  return (
    <>
      <article className="h-[calc(100dvh-48px)] flex divide-x-2">
        <div className="p-3 py-4">
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
          className="relative grow h-screen overflow-y-scroll"
        >
          <div className="min-h-[calc(100%-52px-48px)] mt-4 pb-[52px]">
            {messages.map(
              ({ id, message, nickname, createdAt, font }, index) => (
                <ChatBox
                  sender={nickname}
                  font={font}
                  content={message}
                  createdAt={createdAt}
                  isMe={id === socket.id}
                  key={id + index}
                />
              ),
            )}
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
            <div className="relative  p-2 px-4 bg-background">
              <Input
                autoComplete="off"
                onFocus={() => {
                  setIsEdit(true)
                }}
                className="pr-10"
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
        <aside className="px-4">
          <video autoPlay muted playsInline ref={videoRef}></video>
        </aside>
      </article>
    </>
  )
}

export default RoomPage
