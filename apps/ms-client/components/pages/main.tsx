'use client'
import * as faceapi from 'face-api.js'
import useSocket from '@/hooks/use-socket'
import { useEffect, useRef } from 'react'

const MainPageClient = () => {
  const { socket } = useSocket({
    nsp: '/',
    onRoomChanged(rooms) {
      console.log(rooms)
    },
  })
  const videoRef = useRef<HTMLVideoElement>(null)

  const startVideo = async () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ])
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }

  const handleClick = async () => {
    const dect = await faceapi
      .detectAllFaces(videoRef.current!, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions()

    const expres = dect[0].expressions as any
    let maxV = 0
    let key = ''
    Object.keys(expres).forEach((k) => {
      const v = expres[k]
      if (v > maxV) {
        maxV = v
        key = k
      }
    })
  }
  useEffect(() => {
    socket.emit('events', '123', (data: string) => {
      console.log(data)
    })
    startVideo()
  }, [socket])
  return (
    <div>
      <div>
        <h1>Video</h1>
        <button onClick={handleClick}>GO</button>
      </div>
      <video ref={videoRef} autoPlay muted></video>
    </div>
  )
}

export default MainPageClient
