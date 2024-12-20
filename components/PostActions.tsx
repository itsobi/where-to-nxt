'use client';

import { useMediaQuery } from '@/lib/hooks';

import { CommentType } from '@/lib/queries/getPosts';
import { Trash2 } from 'lucide-react';
import { CreateReplyDialog } from './CreateReplyDialog';
import { ThumbsUp } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { deleteComment } from '@/lib/actions/deleteComment';
import { toast } from 'sonner';
import { likeComment } from '@/lib/actions/like-actions';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  comment: CommentType;
  userId: string | null;
}

export function PostActions({ comment, userId }: PostActionsProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const alreadyLiked = comment.liked_by?.some(
    (like) => like.clerk_user_id === userId
  );

  const handleDeleteComment = async () => {
    startTransition(async () => {
      setPopoverOpen(false);
      const response = await deleteComment(
        comment.author_clerk_user_id,
        comment.id,
        comment.post_id
      );
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
  };

  const handleLikeComment = async () => {
    startTransition(async () => {
      const response = await likeComment(
        alreadyLiked,
        comment.id,
        comment.post_id.toString()
      );
      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="flex items-center mt-4">
      <div className="flex flex-1 gap-4">
        <button
          onClick={handleLikeComment}
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
          {comment.like_count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-black">
              {comment.like_count}
            </span>
          )}
        </button>
        <CreateReplyDialog
          comment={comment}
          postId={comment.post_id.toString()}
        />
      </div>
      {comment.author_clerk_user_id === userId && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <Trash2
              className="text-red-500"
              size={isLargeScreen ? 18 : 16}
              onClick={() => setPopoverOpen(true)}
            />
          </PopoverTrigger>
          <PopoverContent>
            <h4 className="font-semibold mb-2">
              Are you sure you want to delete this post?
            </h4>

            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={() => setPopoverOpen(false)}
                variant="outline"
                className="bg-gray-100 hover:bg-gray-200 hover:text-black"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteComment}
                disabled={isPending}
              >
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
