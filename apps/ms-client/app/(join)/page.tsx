'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { USER_UNIQUE_KEY } from '@/constants'
import { cn, generateNickname } from '@/lib/utils'
import { User } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
const formSchema = z.object({
  nickname: z.string().min(1),
  avatar: z.string().min(1, { message: '아바타를 선택해 주세요.' }),
})

const JoinPage = () => {
  const router = useRouter()
  const nickname = useRef(generateNickname()).current
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      nickname,
      avatar: '',
    },
    resolver: zodResolver(formSchema),
  })

  const isAvatarSelected = form.watch().avatar

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = (await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => res.json())) as User
      if (response.id) {
        localStorage.setItem(USER_UNIQUE_KEY, response.id)
      }
      router.push('/chat/9f8bbd24-9d98-4580-927f-15168791c121')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="max-w-sm py-4 sm:py-0 flex flex-col sm:justify-center mx-auto w-full px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:max-h-[50dvh] justify-center flex flex-col h-full"
        >
          <div className="flex flex-col space-y-2 justify-center items-center pb-2">
            <div className="w-12 h-12 relative">
              <Image src="/images/logo.png" alt="logo" fill />
            </div>
            <h1 className="logo text-4xl">EmoChat</h1>
          </div>
          <div className="pt-6">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <Label>이름</Label>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isLoading}
                      placeholder="이름을 입력해주세요."
                      className="text-lg py-6"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="pt-8">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <Label>프로필 사진</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((item) => (
                      <label
                        key={item}
                        htmlFor={item + ''}
                        aria-disabled={isLoading}
                        className={cn(
                          'aspect-square border relative duration-300 rounded-lg border-[#D0D5DD]',
                          isLoading ||
                            (isAvatarSelected && isAvatarSelected !== item + '')
                            ? 'opacity-50'
                            : isAvatarSelected && 'border-[#0C8AFF] border-2',
                        )}
                      >
                        <Image
                          src={`/images/avatar/${item}.png`}
                          alt="avatar"
                          fill
                          className="p-4"
                        />

                        <Input
                          disabled={isLoading}
                          type="radio"
                          name={field.name}
                          value={item + ''}
                          id={item + ''}
                          className="hidden"
                          onChange={(event) => field.onChange(event)}
                        />
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="pt-20">
            <Button
              disabled={!form.formState.isValid || isLoading}
              variant="submit"
              type="submit"
              className="w-full py-6"
            >
              시작하기
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default JoinPage
