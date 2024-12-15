'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { createChatRoom } from '@/lib/actions/createChatRoom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createChatRoomId } from '@/lib/utils';
import { UserType } from '@/lib/queries/getProUser';

interface NewChatRoomDialogProps {
  TriggerComponent: React.ReactNode;
  availableProUsers: UserType[];
}

export function NewChatRoomDialog({
  TriggerComponent,
  availableProUsers,
}: NewChatRoomDialogProps) {
  const { userId: currentUserId } = useAuth();

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateChatRoom = async (
    currentUserId: string,
    userId: string,
    chatRoomId: string
  ) => {
    startTransition(async () => {
      const toastId = toast('Creating chat room...', {
        action: {
          label: 'Cancel',
          onClick: () => toast.dismiss(toastId),
        },
      });

      try {
        const response = await createChatRoom(
          currentUserId,
          userId,
          chatRoomId
        );
        toast.success(response.message);
        router.push(`/messages/${chatRoomId}`);
      } catch (error) {
        toast.error('Something went wrong');
        toast.dismiss(toastId);
      } finally {
        toast.dismiss(toastId);
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerComponent}</DialogTrigger>
      <DialogContent className="max-w-[450px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Create a conversation with a Pro user!
          </DialogDescription>
        </DialogHeader>

        {availableProUsers.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            {availableProUsers.map((user) => {
              const chatRoomId = createChatRoomId(
                user.clerk_user_id,
                currentUserId!
              );
              return (
                <div
                  role="button"
                  key={user.id}
                  className={cn(
                    'flex items-center gap-3 rounded-lg p-2 hover:bg-accent cursor-pointer',
                    isPending && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => {
                    !isPending &&
                      handleCreateChatRoom(
                        currentUserId!,
                        user.clerk_user_id,
                        chatRoomId
                      );
                  }}
                >
                  <Avatar>
                    <AvatarImage src={user.profile_image} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {user.username}
                    </p>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        ) : (
          <div>
            <p className="text-sm text-black text-center py-4">
              No pro users available at the moment.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
