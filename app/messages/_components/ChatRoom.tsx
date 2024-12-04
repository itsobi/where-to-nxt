'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  createMessage,
  getMessages,
  Message,
} from '@/supabase/supabaseRequests';
import { useAuth, useSession, useUser } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface ChatRoomProps {
  chatRoomId: string;
}

export function ChatRoom({ chatRoomId }: ChatRoomProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  useEffect(() => {
    const loadMessages = async () => {
      const token = await getToken({ template: 'supabase' });
      const messages = await getMessages({ chatRoomId, supabaseToken: token });

      if (messages.error) setError('There was an error loading the messages');
      if (messages.data) setMessages(messages.data);
    };
    loadMessages();

    // cleanup function
    return () => {
      setMessages([]);
    };
  }, [getToken, user?.id]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Don't proceed if taskName is empty
    if (!message.trim()) return;

    setError(null);
    const supabaseToken = await getToken({ template: 'supabase' });

    try {
      const addMessage = await createMessage({
        userId: user?.id,
        supabaseToken,
        chatRoomId,
        message,
        username: user?.username,
      });

      if (addMessage.error) {
        setError('There was an error creating the task');
        return;
      }

      // Only update state if we have valid data
      if (addMessage.data?.[0]) {
        setMessages((current) => [...current, addMessage.data[0]]);
        setMessage('');
      }
    } catch (err) {
      setError('There was an error creating the task');
    }
  };

  if (error) return <div>Error: {error}</div>;

  if (messages.length === 0) return <div>No messages yet</div>;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="w-full py-4 px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.clerk_user_id === user?.id
                  ? 'justify-end'
                  : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[70%] px-4 py-2 rounded-2xl',
                  message.clerk_user_id === user?.id
                    ? 'bg-primary-blue'
                    : 'bg-gray-800'
                )}
              >
                {message.clerk_user_id !== user?.id && (
                  <p className="text-sm text-gray-400 mb-1">
                    {message.username}
                  </p>
                )}
                <p className="text-white">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          onSubmit={handleSendMessage}
          className="w-full mx-auto flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Send a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
