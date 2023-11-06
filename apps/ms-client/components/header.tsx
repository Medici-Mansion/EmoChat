'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { ModeToggle } from './mode-toggle'
import UserSetting from './user-setting'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null)

  const onResize = useCallback(() => {
    if (headerRef.current) {
      const height = headerRef.current?.clientHeight ?? 0
      document.documentElement.style.setProperty(
        '--header-height',
        `${height}px`,
      )
    }
  }, [])

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
      <div className="flex pl-2 space-x-2 items-center">
        <Link href="/lobby" className="w-6 h-6 relative">
          <Image src="/images/logo.png" alt="logo" fill />
        </Link>
        <h1 className="font-extrabold text-2xl">EmoChat</h1>
      </div>
      <div className="flex items-center space-x-4">
        <UserSetting />
        {/* <CreateRoomForm /> */}
        <ModeToggle />
      </div>
    </div>
  )
}

export default Header
