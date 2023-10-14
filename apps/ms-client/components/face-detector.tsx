'use client'
import React, { useEffect, useRef } from 'react'
import * as faceapi from 'face-api.js'
const FaceDetector = () => {
  const streamRef = useRef<MediaStream>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const startVideo = async () => {
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
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }

    streamRef.current = stream
  }

  useEffect(() => {
    startVideo()

    return () => {
      streamRef.current?.getTracks().map((track) => {
        track.stop()
      })
    }
  }, [])
  return (
    <div>
      <video ref={videoRef} autoPlay muted playsInline></video>
    </div>
  )
}

export default FaceDetector
