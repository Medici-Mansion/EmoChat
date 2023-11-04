'use client'
import React, { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimate,
  useAnimation,
} from 'framer-motion'
import Image from 'next/image'
import { slideUpAndScaleTransition } from '@/motion'

interface SplashScreenProps {
  isInfinity?: boolean
}
const SplashScreen = ({ isInfinity = false }: SplashScreenProps) => {
  const baseText = 'EmoChat'
  const control = useAnimation()
  const [completed, setCompleted] = useState(false)
  const transition = {
    repeat: isInfinity ? Infinity : 0,
    repeatType: 'reverse' as const,
  }
  return (
    <AnimatePresence>
      {!completed && (
        <motion.div
          variants={{
            animate: {
              transition: {
                delay: 1,
                when: 'afterChildren',
              },
            },
            exit: {
              opacity: 0,
              transition: {
                // duration: 0.5,
              },
            },
          }}
          animate="animate"
          exit="exit"
          onAnimationComplete={() => {
            !isInfinity && setTimeout(() => setCompleted(true), 500)
          }}
          className="h-[100dvh] sm:h-screen flex items-center justify-center flex-col space-y-4 fixed w-full bg-background top-0"
        >
          <motion.div
            variants={{
              animate: {
                y: [5, -5],
                scale: [0.85, 1.2],
                rotateZ: [0, -4, 4, -4, 4, 0],
                transition: {
                  rotateZ: {
                    delay: 1,
                    duration: 0.3,
                    ease: 'easeInOut',
                    type: 'tween',
                  },
                  y: {
                    duration: 0.5,
                    bounce: 0.8,
                  },
                  scale: {
                    duration: 0.5,
                    bounce: 0.8,
                  },
                  when: 'afterChildren',
                },
              },
              exit: {
                y: 0,
                scale: 1,
              },
            }}
            className="relative w-12 h-12"
          >
            <Image fill src="/images/logo.png" alt="logo" />
          </motion.div>
          <motion.div
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.08,
                  when: 'afterChildren',
                  ...transition,
                },
              },
            }}
            initial="initial"
            animate="animate"
            className="font-extrabold text-4xl h-10"
          >
            {baseText.split('').map((item, index) => {
              return (
                <motion.span
                  key={item}
                  variants={{ ...slideUpAndScaleTransition() }}
                >
                  {item}
                </motion.span>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen
