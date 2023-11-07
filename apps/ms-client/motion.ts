import { Variants } from 'framer-motion'

export const slideUpAndScaleTransition = (): Variants => ({
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.7,
  },
  animate: {
    display: 'inline-block',
    opacity: 1,
    y: 0,
    scale: 1,
  },
})
