'use client'
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { RotateCw } from 'lucide-react'
import * as faceapi from 'face-api.js'
import { motion, useAnimation } from 'framer-motion'
import { Emotion } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import AnimatedRefresh from '@/components/animate-refresh'

interface FaceDetectorProps {
  intervalTime?: number
  batchRunning?: boolean
  onEmotionChange?: (emotion: Emotion) => void
  header?: ReactNode
}

const FaceDetector = ({
  header,
  intervalTime = 500,
  batchRunning = true,
  onEmotionChange,
}: FaceDetectorProps) => {
  const streamRef = useRef<MediaStream>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const checkCnt = useRef<number>(0)
  const timer = useRef<NodeJS.Timeout>()

  const control = useAnimation()

  const emotionRef = useRef<{
    emotion: string
    others?: faceapi.FaceExpressions
  }>({
    emotion: 'neutral',
  })

  const startStream = useCallback(async () => {
    if (typeof window === 'undefined') return
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ])
    const stream = await window?.navigator?.mediaDevices.getUserMedia({
      audio: false,
      video: {
        aspectRatio: 9 / 12,
        width: 200,
        facingMode: 'user',
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
          checkCnt.current = cnt
          emotionRef.current = {
            emotion: key,
            others: expres,
          }
          onEmotionChange &&
            onEmotionChange({
              emotion: key,
              others: expres,
            })
        }
      }
    },
    [onEmotionChange],
  )

  const getEmotionBatch = useCallback(() => {
    let cnt = 0
    return setInterval(async () => {
      await getEmotion(cnt)
      cnt++
    }, intervalTime)
  }, [getEmotion, intervalTime])

  useEffect(() => {
    if (batchRunning) {
      clearInterval(timer.current)
      timer.current = getEmotionBatch()
    } else {
      clearInterval(timer.current)
    }
    return () => {
      clearInterval(timer.current)
    }
  }, [batchRunning, getEmotionBatch])

  useEffect(() => {
    startStream()
    return () => {
      stopStream()
    }
  }, [startStream, stopStream])

  return (
    <aside className="invisible w-0 p-3 sm:visible sm:w-full px-0 sm:px-4">
      <div className="w-fit mx-auto">
        {header}
        <video
          autoPlay
          muted
          playsInline
          ref={videoRef}
          className="rounded-2xl"
        ></video>
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger className="absolute bottom-6 hidden sm:block">
            <AnimatedRefresh
              onClick={() => {
                onEmotionChange &&
                  onEmotionChange({
                    emotion: 'neutral',
                  })
              }}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>내 감정 초기화 하기</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </aside>
  )
}

export default FaceDetector
