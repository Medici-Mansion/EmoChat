import { fadeInOutMotion } from '@/motions'
import { Sentiment } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'

interface SentimentsRadioProps {
  sentiments: Sentiment[]
  onValueChange?: (sentiment: Sentiment) => void
}
const SentimentsRadio = ({
  sentiments,
  onValueChange,
}: SentimentsRadioProps) => {
  return (
    <AnimatePresence mode="popLayout">
      {sentiments.map((sm) => (
        <motion.div {...fadeInOutMotion} key={sm.id}>
          <input
            className="peer hidden "
            name="sentiment"
            type="radio"
            value={sm.id}
            id={sm.id}
            onChange={() => {
              onValueChange && onValueChange(sm)
            }}
          />
          <label
            htmlFor={sm.id}
            className="px-3 py-1 sm:px-4 sm:py-2 rounded-md border-2 border-muted-foreground bg-chatbox-others-box peer-checked:text-chatbox-me-box peer-checked:border-chatbox-me-box duration-300 whitespace-nowrap"
          >
            {sm.name}
          </label>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default SentimentsRadio
