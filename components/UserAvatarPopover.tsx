'use client';

import * as React from 'react';
import { MessageSquare, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUser } from '@clerk/nextjs';
import { createChatRoomId } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { createChatRoom } from '@/lib/actions/createChatRoom';

interface UserAvatarPopoverProps {
  author_clerk_user_id: string;
  author_username: string;
  author_profile_image: string;
}

export function UserAvatarPopover({
  author_clerk_user_id,
  author_username,
  author_profile_image,
}: UserAvatarPopoverProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  if (!user) return null;

  const chatRoomId = createChatRoomId(user.id, author_clerk_user_id);

  const handleCreateChatRoom = async () => {
    startTransition(async () => {
      const response = await createChatRoom(
        user.id,
        author_clerk_user_id,
        chatRoomId
      );
      if (response.chat_room_id) {
        router.push(`/messages/${chatRoomId}`);
      } else if (response.success) {
        toast.success(response.message);
        router.push(`/messages/${chatRoomId}`);
      } else {
        console.log(response.message);
        toast.error(response.message);
      }
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar>
            <AvatarImage src={author_profile_image} alt={author_username} />
            <AvatarFallback>{author_username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            onClick={() => {
              router.push(`/u/${author_clerk_user_id}`);
            }}
            className="flex items-center justify-start gap-2 rounded-none px-4 py-2 hover:bg-gray-100 text-sm hover:text-primary-blue"
          >
            <User className="h-4 w-4" />
            View profile
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
