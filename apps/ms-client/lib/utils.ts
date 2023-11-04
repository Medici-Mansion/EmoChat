import { User } from '@/types'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function randomInt(num: number) {
  return Math.floor(Math.random() * num)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const checkUser = async (userId: string) => {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/users`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
    }),
  })
  const { user } = (await response.json()) as { user: User | null }

  return user
}
export const generateNickname = () => {
  const determiners = [
    '예쁜',
    '화난',
    '귀여운',
    '배고픈',
    '철학적인',
    '도전적인',
    '슬픈',
    '푸른',
    '하품하는',
    '물놀이하는',
    '밝은',
  ]
  const animals = [
    '호랑이',
    '비버',
    '강아지',
    '부엉이',
    '여우',
    '치타',
    '문어',
    '고양이',
    '미어캣',
    '다람쥐',
    '하마',
    '물개',
  ]

  return typeof window === 'undefined'
    ? '귀여운 이름 생성중...'
    : `${determiners[randomInt(determiners.length)]} ${
        animals[randomInt(determiners.length)]
      }`
}
