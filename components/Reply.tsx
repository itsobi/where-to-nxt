'use client';

import { ReplyType } from '@/lib/queries/getComments';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { SubReplyDialog } from './SubReplyDialog';
import { SignedIn, useUser } from '@clerk/nextjs';
import { ThumbsUp, Trash2 } from 'lucide-react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { likeReply } from '@/lib/actions/like-actions';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

interface ReplyProps {
  reply: ReplyType;
  postId: string;
  userId: string | null;
}

export function Reply({ reply, postId, userId }: ReplyProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  const alreadyLiked = user?.id
    ? reply.liked_by.some((like) => like.clerk_user_id === user.id)
    : false;

  const handleLikeReply = async () => {
    startTransition(async () => {
      const response = await likeReply(
        alreadyLiked,
        reply.id,
        postId,
        reply.comment_id?.toString() || ''
      );

      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className={cn('p-4')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex flex-col items-center relative">
            <Avatar>
              <AvatarImage
                src={reply.author_profile_image}
                alt={reply.username}
              />
              <AvatarFallback>
                {reply.username[0].toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{reply.username}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(reply.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {userId ? (
              <p className="text-sm lg:text-base">{reply.content}</p>
            ) : (
              <div className="space-y-2 mt-1">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-[75%] h-4" />
              </div>
            )}

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleLikeReply}
                disabled={isPending}
                className="relative"
              >
                <ThumbsUp
                  size={isLargeScreen ? 18 : 16}
                  className={cn(
                    'text-black hover:text-green-400',
                    alreadyLiked && 'text-green-400'
                  )}
                />
                {reply.like_count > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs text-black">
                    {reply.like_count}
                  </span>
                )}
              </button>
              <SubReplyDialog reply={reply} postId={postId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
