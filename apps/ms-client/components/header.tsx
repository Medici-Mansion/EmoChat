'use client'
import React from 'react'
import { ModeToggle } from './mode-toggle'
import UserSetting from './user-setting'
import Image from 'next/image'

interface HeaderProps {}

const Header = () => {
  return (
    <div className="bg-secondary w-ful h-12 flex items-center px-4 text-2xl justify-between border">
      <div className="flex space-x-4 items-center">
        <div className="w-6 h-6 relative">
          <Image src="/images/logo.png" alt="logo" fill />
        </div>
        <span className="text-ellipsis whitespace-nowrap">
          Emotion Detection Messenger
        </span>
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
