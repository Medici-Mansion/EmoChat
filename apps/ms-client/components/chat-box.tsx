import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Label } from './ui/label'

type ChatBoxProps = {
  isMe: boolean
  content: string
  emotion: string
  sender: string
}

const ChatBox = ({ content, isMe, emotion, sender }: ChatBoxProps) => {
  return (
    <motion.div
      className={cn(
        'flex items-start gap-x-1 py-2 w-full relative',
        isMe ? 'pr-2 pl-10 flex-row-reverse' : 'pr-10 pl-2',
      )}
    >
      {/* {isMe ? myIcon : senderIcon} */}
      <div className={cn('flex flex-col', isMe && 'text-right')}>
        <Label>{sender}</Label>
        <motion.div
          initial={{
            x: isMe ? 10 : -10,
            scaleY: 0.2,
            scaleX: 0.1,
          }}
          animate={{
            x: 0,
            scaleY: 1,
            scaleX: 1,
          }}
          transition={{
            type: 'tween',
            duration: 0.1,
          }}
          className={cn(
            'rounded-md px-4 py-2 m-2 max-x-sm text-sm relative group',
            isMe
              ? 'origin-right bg-card-foreground text-black'
              : 'origin-left bg-primary/10',
          )}
        >
          {content}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ChatBox
