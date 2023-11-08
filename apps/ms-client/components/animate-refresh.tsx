import React, { ExoticComponent, HTMLAttributes, RefAttributes } from 'react'
import { Button } from './ui/button'
import { LucideProps, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  HTMLMotionProps,
  MotionProps,
  SVGMotionProps,
  motion,
  useAnimation,
} from 'framer-motion'
const RotateIcon = motion(RotateCw)
interface IconProps extends Omit<LucideProps & MotionProps, 'ref'> {}

interface AnimatedRefreshProps extends HTMLAttributes<HTMLButtonElement> {
  iconProps?: IconProps
}

const AnimatedRefresh = ({ ...props }: AnimatedRefreshProps) => {
  const animate = useAnimation()
  return (
    <Button
      {...props}
      onClick={(event) => {
        props.onClick && props.onClick(event)
        animate.start('animate').then(() => {
          animate.set({ rotate: 0 })
        })
      }}
      onMouseEnter={() => {
        animate.start('hover')
      }}
      onMouseLeave={() => {
        animate.set({ rotate: 0 })
      }}
      variant="outline"
      className={cn('aspect-square group h-9 p-0', props.className)}
    >
      <RotateIcon
        {...props.iconProps}
        variants={{
          hover: {
            rotate: '15deg',
            transition: {
              duration: 0.2,
            },
          },
          animate: {
            rotate: '360deg',
            transition: {
              duration: 0.3,
              ease: 'easeInOut',
            },
          },
        }}
        animate={animate}
        className={cn(props.iconProps?.className)}
      />
    </Button>
  )
}

export default AnimatedRefresh
