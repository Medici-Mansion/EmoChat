import { NextRequest, NextResponse } from 'next/server'
import { USER_UNIQUE_KEY } from './constants'
import { checkUser } from './lib/utils'

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get(USER_UNIQUE_KEY)?.value
  const response = NextResponse.next()
  if (request.nextUrl.pathname !== '/') {
    if (!userId) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    const user = await checkUser(userId)
    if (!user) return NextResponse.redirect(new URL('/', request.url))
  }
  return response
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|models).*)'],
}
