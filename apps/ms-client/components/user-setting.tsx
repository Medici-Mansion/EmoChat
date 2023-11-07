
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import useSocket from '@/hooks/use-socket'
import { SocketContext } from './providers/socket-provier'
import { Input } from '@/components/ui/input'
import { Button } from './ui/button'
import { User as UserIcon } from 'lucide-react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formschema = z.object({
  nickname: z.string(),
})

type UserSettingParams = z.infer<typeof formschema>


interface Images {
  id: number
  value: string
  active: boolean
  src: string
}

const images: Images[] = [
  { id: 0, value: '0', active: true, src: '/images/avatar/0.png' },
  { id: 1, value: '1', active: false, src: '/images/avatar/1.png' },
  { id: 2, value: '2', active: false, src: '/images/avatar/2.png' },
  { id: 3, value: '3', active: false, src: '/images/avatar/3.png' },
]

const UserSetting = () => {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(0)
  const { setInfo } = useContext(SocketContext)

  const { socket } = useSocket({
    nsp: '/',
    onUserUpdated(user) {
      setNickname(user.nickname, user.profile)
    },
  })

  const form = useForm<UserSettingParams>()

  const setNickname = useCallback(
    (nickname: string, profile: string) => {
      setInfo?.({ id: socket.id, nickname: nickname, profile: profile })
      form.setValue('nickname', nickname)
      form.setValue('profile', profile)
    },
    [form, setInfo, socket.id],
  )

  const onSubmit = (data: UserSettingParams) => {
    // TYPE_ALIAS : data => client.data
    socket.emit('USER_SETTING', data, (data: UserSettingParams) => {
      setNickname(data.nickname, data.profile)
      open && setOpen(false)
    })
  }

  useEffect(() => {
    socket.on('USER_SETTING', (user) => {
      setInfo?.(user)
    })
    return () => {
      socket.off('USER_SETTING')
    }
  }, [setInfo, socket])

  useEffect(() => {
    if (open) {
      form.setValue('nickname', info?.nickname || '')
    }
  }, [form, info?.nickname, open, socket])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="shadow-none">
          <UserIcon className={cn(open ? 'text-[#0C8AFF]' : '')} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Form {...form}>
          <form
            className="flex flex-col p-3 space-y-5 w-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex justify-between">
              <div className="text-[#0C8AFF] text-[18px]">사용자 설정</div>
              <X
                className="w-6 h-6 text-[#868B8E]"
                onClick={() => setOpen(false)}
              />
            </div>
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center"></div>
                  <div className="space-y-2">
                    <Label className="text-[#B2B7C2] text-[16px]">이름</Label>
                    <Input className="col-span-3" {...field} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-2">
                    <Label className="text-[#B2B7C2] text-[16px]" {...field}>
                      프로필사진
                    </Label>
                    <div className="grid grid-cols-2 sm:flex px-3 gap-3">
                      {images.map((img) => (
                        <div
                          className="aspect-square relative w-16 h-16"
                          key={img.id}
                        >
                          <Image
                            src={img.src}
                            alt="avatar"
                            fill
                            className={cn(
                              'aspect-square border p-2 rounded-lg ',
                              activeId === img.id
                                ? 'border-[#0C8AFF] border-2 duration-300'
                                : 'opacity-50',
                            )}
                            onClick={() => {
                              setActiveId(img.id)
                              form.setValue('profile', img.value)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setOpen(false)}
                variant={'outline'}
                className="text-black w-full"
              >
                취소
              </Button>
              <Button
                variant={'submit'}
                type="submit"
                className="bg-[#0C8AFF]  w-full"
              >
                확인
              </Button>
            </div>
          </form>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserSetting
