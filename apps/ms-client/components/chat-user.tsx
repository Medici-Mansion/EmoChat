import React from 'react'
import RoomCard from '@/components/room-card'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeInOutMotion } from '@/motions'
import { Users } from 'lucide-react'

interface ChatUserProps {
  roomName: string
  users: string[]
}
const ChatUser = ({ roomName, users }: ChatUserProps) => {
  return (
    <div className="p-3 py-4 hidden sm:block">
      <RoomCard roomName={roomName} />
      <div className="flex flex-col space-y-2 mt-2">
        <AnimatePresence mode="popLayout">
          {users.map((user, index) => (
            <motion.div
              {...fadeInOutMotion}
              key={user + index}
              className="flex items-center space-x-2"
            >
              <Users />
              <p>{user}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ChatUser
