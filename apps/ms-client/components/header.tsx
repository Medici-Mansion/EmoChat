'use client'
import React, { ReactNode } from 'react'
import { ModeToggle } from './mode-toggle'
import { usePathname } from 'next/navigation'
import CreateRoomForm from './create-room-form'
import UserSetting from './user-setting'

interface HeaderProps {}

const Header = () => {
  const path = usePathname()
  const title =
    path.split('/').filter((item) => item !== 'chat' && !!item)[0] || 'Lobby'
  return (
    <div className="bg-secondary w-ful h-12 flex items-center px-2 text-4xl justify-between">
      <span>{decodeURIComponent(title)}</span>
      <div className="flex items-center space-x-4">
        <UserSetting />
        <CreateRoomForm />
        <ModeToggle />
      </div>
    </div>
  )
}

export default Header
