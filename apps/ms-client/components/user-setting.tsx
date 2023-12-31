import * as z from 'zod'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'

import { User as UserIcon, X } from 'lucide-react'

import useSocket from '@/hooks/use-socket'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { SocketContext } from './providers/socket-provier'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formschema = z.object({
  nickname: z.string(),
  avatar: z.string(),
})

type UserSettingParams = z.infer<typeof formschema>

interface Images {
  value: string
  active: boolean
  src: string
}

const images: Images[] = [
  { value: '0', active: false, src: '/images/avatar/0.png' },
  { value: '1', active: false, src: '/images/avatar/1.png' },
  { value: '2', active: false, src: '/images/avatar/2.png' },
  { value: '3', active: false, src: '/images/avatar/3.png' },
]

const UserSetting = () => {
  const form = useForm<UserSettingParams>({
    defaultValues: {
      nickname: '',
      avatar: '',
    },
    resolver: zodResolver(formschema),
  })

  const [open, setOpen] = useState(false)
  const { info, setInfo } = useContext(SocketContext)
  const [activeId, setActiveId] = useState(info?.avatar || '0')
  const { socket } = useSocket({
    nsp: '/',
  })

  const onSubmit = (data: UserSettingParams) => {
    socket.emit('USER_SETTING', data)
    setOpen(false)
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
      form.setValue('avatar', info?.avatar || '')
      setActiveId(info?.avatar || '')
    }
  }, [form, info, open, socket])

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
              name="avatar"
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
                          key={img.value}
                        >
                          <Image
                            src={img.src}
                            alt="avatar"
                            fill
                            className={cn(
                              'aspect-square border p-2 rounded-lg',
                              activeId === img.value
                                ? 'border-[#0C8AFF] border-2 duration-300'
                                : 'opacity-50',
                            )}
                            onClick={() => {
                              setActiveId(img.value)
                              form.setValue('avatar', img.value)
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
                className="text-primary w-full"
              >
                취소
              </Button>
              <Button variant={'submit'} type="submit" className="w-full">
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
