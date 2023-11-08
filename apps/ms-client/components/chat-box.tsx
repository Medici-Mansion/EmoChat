import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { Label } from './ui/label'
import { Font } from '@/socket'
import { User } from '@/types'
import DefaultAvatar from './default-avatar'

type ChatBoxProps = {
  isMe: boolean
  content: string
  sender: User
  createdAt: Date
  font?: Font
}

const ChatBox = ({ content, isMe, createdAt, font, sender }: ChatBoxProps) => {
  const generateTimeString = useCallback((time: Date) => {
    const timeForm = new Intl.DateTimeFormat('ko', {
      timeStyle: 'medium',
      hour12: true,
    })
      .format(time)
      .split(':')
    timeForm.pop()
    return timeForm.join(':')
  }, [])

  return (
    <motion.div
      className={cn(
        'flex items-start gap-x-1 w-full relative',
        isMe ? 'pr-2 pl-10 flex-row-reverse' : 'pr-10 pl-2',
      )}
    >
      {/* {isMe ? myIcon : senderIcon} */}
      <div
        className={cn('flex flex-col space-y-2', isMe ? 'text-right' : 'm-2')}
      >
        <Label>{!isMe && sender?.nickname}</Label>

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
        >
          <span className={cn('text-xs', !isMe && 'ml-2')}>
            {generateTimeString(createdAt)}
          </span>
          <div
            className={cn(
              'rounded-2xl px-6 py-4 max-x-sm relative group text-2xl ',
              isMe
                ? 'origin-right bg-chatbox-me-box text-chatbox-me-text rounded-br-sm'
                : 'origin-left bg-chatbox-others-box text-chatbox-others-text rounded-bl-sm',
              !font && 'text-xl',
            )}
            style={
              font
                ? {
                    fontFamily: `var(--font-${font.code})`,
                  }
                : {}
            }
          >
            {content}
          </div>
          {!isMe && sender?.isDefaultAvatar ? (
            <div className="pr-4">
              <DefaultAvatar avatar={sender.avatar} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ChatBox
