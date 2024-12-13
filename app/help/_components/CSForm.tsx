'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useTransition } from 'react';
import { sendCSTicket } from '@/lib/actions/sendCSTicket';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string(),
  email: z.string(),
  subject: z.string().min(2).max(50),
  message: z.string().min(2).max(500),
});

interface CSFormProps {
  username: string;
  email: string;
}

export function CSForm({ username, email }: CSFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: username,
      email: email,
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await sendCSTicket(formData);
      if (response.success) {
        form.reset();
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
  }

  return (
    <div className="col-span-full">
      <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-x-2 mb-6">
          <Image src="/logo.svg" alt="Where To NXT?" width={40} height={40} />
          <h2 className="text-2xl font-bold">Customer Support</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-blue">Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="username"
                      className="text-sm lg:text-base text-black"
                      disabled
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    (Prefilled)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-blue">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="example@gmail.com"
                      className="text-sm lg:text-base"
                      disabled
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    (Prefilled)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-blue">Subject</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Subject"
                      className="text-sm lg:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-blue">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your inquiry"
                      className="resize-none text-sm lg:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={!form.formState.isValid || isPending}
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
