import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MessageSquarePlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const CreateRoomFormSchema = z.object({
  roomName: z
    .string({ required_error: 'room name is required.' })
    .min(1, 'room name is required.'),
})

const CreateRoomForm = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof CreateRoomFormSchema>>({
    resolver: zodResolver(CreateRoomFormSchema),
    defaultValues: {
      roomName: '',
    },
  })

  const onJoinRoom = ({ roomName }: { roomName: string }) => {
    router.push(`/chat/${roomName}`)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="shadow-none">
          <MessageSquarePlus />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Form {...form}>
          <form
            className="flex flex-col space-y-2"
            onSubmit={form.handleSubmit(onJoinRoom)}
          >
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create Chat Room</FormLabel>
                  <Input className="col-span-3" {...field} />
                  <FormDescription>Create Your Chat Room</FormDescription>
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

export default CreateRoomForm
