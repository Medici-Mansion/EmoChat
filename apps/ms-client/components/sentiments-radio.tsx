import { Sentiment } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

interface SentimentsRadioProps {
  sentiments: Sentiment[]
  onValueChange?: (sentiment: Sentiment) => void
}
const SentimentsRadio = ({
  sentiments,
  onValueChange,
}: SentimentsRadioProps) => {
  return (
    <AnimatePresence>
      {sentiments.map((sm) => (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          exit={{ y: 50, opacity: 0 }}
          key={sm.id}
        >
          <input
            className="peer hidden"
            name="sentiment"
            type="radio"
            value={sm.id}
            id={sm.id}
            onChange={(event) => {
              const {
                target: { value: selectedValue },
              } = event

              onValueChange && onValueChange(sm)
            }}
          />
          <label
            htmlFor={sm.id}
            className="px-4 py-2 rounded-md border-2 border-muted-foreground peer-checked:text-blue-300 peer-checked:border-blue-300 duration-300"
          >
            {sm.name}
          </label>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export default SentimentsRadio
