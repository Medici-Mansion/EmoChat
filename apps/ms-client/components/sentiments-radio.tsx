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
            className="px-4 py-2 rounded-md border-2 border-muted-foreground peer-checked:text-blue-300 peer-checked:border-blue-300 duration-300 whitespace-nowrap"
          >
            {sm.name}
          </label>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default SentimentsRadio
