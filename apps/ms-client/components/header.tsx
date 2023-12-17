'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ModeToggle } from './mode-toggle'
import UserSetting from './user-setting'
import Image from 'next/image'
import Link from 'next/link'
import { Info } from 'lucide-react'
import Modal from './modal'

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const onResize = useCallback(() => {
    if (headerRef.current) {
      const height = headerRef.current?.clientHeight ?? 0
      document.documentElement.style.setProperty(
        '--header-height',
        `${height}px`,
      )
    }
  }, [])

  const modalHandler = () => {
    setOpen((prev) => !prev)
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    onResize()

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  useEffect(() => {
    if (!window?.requestIdleCallback) {
      // 아이폰 requestIdleCallback 미지원 이슈
      // @ts-ignore
      window.requestIdleCallback = function (cb) {
        var start = Date.now()
        return setTimeout(function () {
          cb({
            didTimeout: false,
            timeRemaining: function () {
              return Math.max(0, 50 - (Date.now() - start))
            },
          })
        }, 1)
      }
    }
  }, [])
  return (
    <div
      ref={headerRef}
      className="bg-secondary w-screen h-12 flex items-center px-4 text-2xl justify-between border-b"
    >
      <div className="flex pl-2 space-x-3 items-center">
        <div className="w-6 h-6 relative">
          <Image src="/images/logo.png" alt="logo" fill />
        </div>
        <h1 className="logo text-xl">EmoChat</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Info onClick={() => setOpen(true)} className="cursor-pointer" />
        <UserSetting />
        {/* <CreateRoomForm /> */}
        <ModeToggle />
      </div>
      <Modal modalHandler={modalHandler} isOpen={open} />
    </div>
  )
}

export default Header
