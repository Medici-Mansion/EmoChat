import { USER_UNIQUE_KEY } from '@/constants'
import { User } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, res: NextResponse) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/create`
  const body = await req.json()
  const response = (await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())) as User
  const result = NextResponse.json(response)
  result.cookies.set(USER_UNIQUE_KEY, response.id)
  return result
}
