import React, { useCallback, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
const formSchema = z.object({
  roomName: z.string({ required_error: '방 이름을 입력해주세요.' }),
})

type RoomSettingForm = z.infer<typeof formSchema>
interface RoomSettingProps extends Partial<RoomSettingForm> {
  onSubmit: (data: RoomSettingForm) => void
}

const RoomSetting = ({ roomName = '', onSubmit }: RoomSettingProps) => {
  const [open, setOpen] = useState(false)
  const form = useForm<RoomSettingForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName,
    },
  })

  const onValid = useCallback(
    (values: RoomSettingForm) => {
      onSubmit && onSubmit(values)
      setOpen(false)
    },
    [onSubmit],
  )

  useEffect(() => {
    if (open) {
      form.setValue('roomName', roomName)
    }
  }, [form, open, roomName])
  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger>
        <Pencil className={cn('duration-75', open && 'text-chatbox-me-box')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onValid)}
            className="relative flex-col flex space-y-2"
          >
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>채팅방명 수정</FormLabel>
                  <Input {...field} />
                </FormItem>
              )}
            />
            <div className="flex justify-between space-x-2">
              <Button
                onClick={() => setOpen(false)}
                variant="ghost"
                className="flex-1"
              >
                취소
              </Button>
              <Button type="submit" className="flex-1">
                확인
              </Button>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-0 -top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <Cross2Icon className={cn('h-4 w-4')} />
              <span className="sr-only">Close</span>
            </button>
          </form>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RoomSetting
