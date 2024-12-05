'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/lib/queries/getChatRoomMessages';
import { cn } from '@/lib/utils';
import { supabaseClient } from '@/supabase/client';
import { createMessage } from '@/supabase/supabaseRequests';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface ChatRoomProps {
  chatRoomId: string;
  preRenderedMessages: Message[];
}

const supabase = supabaseClient();

export function ChatRoom({ chatRoomId, preRenderedMessages }: ChatRoomProps) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[] | []>(preRenderedMessages);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          console.log('Change received!', payload);
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (messages.length > 10) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        toast.error('There was an error creating the message');
        setError('There was an error creating the task');
        return;
      }
    } catch (err) {
      console.log('err', err);
      setError('There was an error creating the task');
    } finally {
      setMessage('');
    }
  };

  if (error) return <div>Error: {error}</div>;

  if (messages?.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[90vh] flex items-center justify-center">
          <div className="text-gray-500">No messages yet</div>
        </div>
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

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="h-[90vh] overflow-y-auto">
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

        <div ref={messageEndRef} />
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
