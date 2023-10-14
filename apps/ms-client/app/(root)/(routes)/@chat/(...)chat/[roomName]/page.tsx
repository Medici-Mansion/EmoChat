'use client'
import * as faceapi from 'face-api.js'
import ChatBox from '@/components/chat-box'
import { Input } from '@/components/ui/input'
import useSocket from '@/hooks/use-socket'
import { Send } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ReservedMessage } from '@/socket'
import { Sentiment } from '@/types'
import SentimentsRadio from '@/components/sentiments-radio'

const INTERVAL_TIME = 500

interface RoomFormValue {
  message: string
  sentiment?: Sentiment['id']
}

const RoomPage = ({ params: { roomName } }: any) => {
  const [messages, setMessage] = useState<ReservedMessage[]>([])
  const [sentiments, setSentiments] = useState<Sentiment[]>([])
  const [isEdit, setIsEdit] = useState(false)

  const timer = useRef<NodeJS.Timeout>()
  const form = useForm<RoomFormValue>()
  const chatScroller = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream>()
  const emotionRef = useRef<string>('neutral')
  const checkCnt = useRef<number>(0)

  const { socket } = useSocket({
    nsp: '/',
    onMounted(socket) {
      socket.emit('JOIN_ROOM', roomName)
      socket.listen('WELCOME', (message) => {
        console.log('WELCOME', message)
      })

      socket.listen('RESERVE_MESSAGE', (sender) => {
        console.log(sender, '<<sender')
        setMessage((prev) => [...prev, sender])
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
        .detectSingleFace(
          videoRef.current!,
          new faceapi.TinyFaceDetectorOptions(),
        )
        .withFaceExpressions()

      if (dect?.expressions) {
        const expres = dect.expressions as any
        let maxV = 0
        let key = ''
        Object.keys(expres).forEach((k) => {
          const v = expres[k]
          if (v > maxV) {
            maxV = v
            key = k
          }
        })
        if (
          (emotionRef.current !== key && cnt < 10 && key !== 'neutral') ||
          (emotionRef.current !== key && cnt - checkCnt.current > 10)
        ) {
          console.log(emotionRef.current, '<emotionRef.current')
          console.log(key, '<key')
          socket.emit('GET_SENTIMENTS', key, (sentiments: Sentiment[]) => {
            if (key === 'neutral') {
              form.resetField('sentiment')
            }
            setSentiments(sentiments)
          })
          checkCnt.current = cnt
          emotionRef.current = key
        }
      }
    },
    [form, socket],
  )

  const onSubmit = useCallback(
    async ({ message, sentiment }: RoomFormValue) => {
      const emotion = emotionRef.current || 'neutral'
      socket.emit('SEND_MESSAGE', {
        message,
        emotion,
        sentiment: sentiment,
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
    <article className="flex divide-x-2">
      <div
        ref={chatScroller}
        className="relative grow h-screen overflow-y-scroll"
      >
        <div className="min-h-[calc(100vh-52px)] mt-4">
          {messages.map(({ id, message, nickname, font }, index) => (
            <ChatBox
              sender={nickname}
              font={font}
              content={message.message}
              emotion={message.emotion}
              isMe={id === socket.id}
              key={id + index}
            />
          ))}
        </div>

        <form
          className="sticky bottom-0 p-2 px-4 bg-background"
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
          <div className="relative">
            <Input
              onFocus={() => {
                setIsEdit(true)
                console.log(form.getValues())
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
              className="absolute right-2 -top-1/2 translate-y-full hover:cursor-pointer"
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
  )
}

export default RoomPage
