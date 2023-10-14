import React from 'react'
import Popup from '@/components/ui/popup'
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

const CreateRoomFormSchema = z.object({
  roomName: z
    .string({ required_error: 'room name is required.' })
    .min(1, 'room name is required.'),
})

interface CreateRoomFormProps {
  onSubmit: (roomInfo: z.infer<typeof CreateRoomFormSchema>) => void
}

const CreateRoomForm = ({ onSubmit }: CreateRoomFormProps) => {
  const form = useForm<z.infer<typeof CreateRoomFormSchema>>({
    resolver: zodResolver(CreateRoomFormSchema),
    defaultValues: {
      roomName: '',
    },
  })

  return (
    <Popup
      label="Create Chat Room"
      content={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>roomName</FormLabel>
                  <Input className="col-span-3" {...field} />
                  <FormDescription>??</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      }
    />
  )
}

export default CreateRoomForm
