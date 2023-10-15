import { Variants } from 'framer-motion'

export const fadeInOutMotion: Variants = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 50,
    opacity: 0,
  },
}
export const fadeInOutReverseMotion: Variants = {
  initial: {
    y: -50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: -50,
    opacity: 0,
  },
}
