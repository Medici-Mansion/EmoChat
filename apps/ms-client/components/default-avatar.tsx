import Image from 'next/image'
import React from 'react'
interface DefaultAvatarProps {
  avatar: string
}
const DefaultAvatar = ({ avatar }: DefaultAvatarProps) => {
  return (
    <div className="aspect-square relative w-8 h-8">
      <Image src={`/images/avatar/${avatar}.png`} alt="avatar" fill />
    </div>
  )
}

export default DefaultAvatar
