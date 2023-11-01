'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import * as faceapi from 'face-api.js'
import { Emotion } from '@/types'

interface FaceDetectorProps {
  intervalTime?: number
  batchRunning?: boolean
  onEmotionChange?: (emotion: Emotion) => void
}

const FaceDetector = ({
  intervalTime = 500,
  batchRunning = true,
  onEmotionChange,
}: FaceDetectorProps) => {
  const streamRef = useRef<MediaStream>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const checkCnt = useRef<number>(0)
  const timer = useRef<NodeJS.Timeout>()

  const emotionRef = useRef<{
    emotion: string
    others?: faceapi.FaceExpressions
  }>({
    emotion: 'neutral',
  })

  const startStream = useCallback(async () => {
    if (typeof window === 'undefined') return
    Promise.all([
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
    <aside className="invisible w-0 sm:visible sm:w-fit px-0 sm:px-4">
      <video autoPlay muted playsInline ref={videoRef}></video>
    </aside>
  )
}

export default FaceDetector
