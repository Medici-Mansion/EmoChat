import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ReactNode, useCallback } from 'react'
import { Label } from './ui/label'
import { Font } from '@/socket'

type ChatBoxProps = {
  isMe: boolean
  content: string
  emotion: string
  sender: string
  createdAt: Date
  font?: Font
}

const ChatBox = ({
  content,
  isMe,
  emotion,
  createdAt,
  font,
  sender,
}: ChatBoxProps) => {
  const generateTimeString = useCallback(
    (time: Date) =>
      new Intl.DateTimeFormat('ko', {
        timeStyle: 'medium',
        hour12: true,
      }).format(time),
    [],
  )
  return (
    <motion.div
      className={cn(
        'flex items-start gap-x-1 w-full relative',
        isMe ? 'pr-2 pl-10 flex-row-reverse' : 'pr-10 pl-2',
      )}
    >
      {/* {isMe ? myIcon : senderIcon} */}
      <div className={cn('flex flex-col m-2 space-y-2', isMe && 'text-right')}>
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
            'flex items-end',
            !isMe ? 'flex-row-reverse' : 'space-x-2',
          )}
          style={
            font
              ? {
                  fontFamily: `var(--font-${font.code})`,
                }
              : {}
          }
        >
          <span className={cn('text-xs', !isMe && 'ml-2')}>
            {generateTimeString(createdAt)}
          </span>
          <div
            className={cn(
              'rounded-md px-6 py-4 max-x-sm relative group text-2xl ',
              isMe
                ? 'origin-right bg-yellow-200 text-black'
                : 'origin-left bg-primary/10',
            )}
          >
            {content}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ChatBox
