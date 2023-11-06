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

const UserSetting = () => {
  const [open, setOpen] = useState(false)
  const { setInfo, info } = useContext(SocketContext)
  const { socket } = useSocket({
    nsp: '/',
    onUserUpdated(user) {
      setInfo?.(user)
    },
  })

  const form = useForm<UserSettingParams>({
    defaultValues: {
      nickname: '',
    },
    resolver: zodResolver(formschema),
  })

  const onSubmit = (data: UserSettingParams) => {
    // TYPE_ALIAS : data => client.data
    socket.emit('USER_SETTING', data)
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
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Form {...form}>
          <form
            className="flex flex-col space-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <Input className="col-span-3" {...field} />
                  <FormDescription>Set your nickname</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserSetting
