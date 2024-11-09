'use client';

import { CommentType } from '@/lib/queries/getPosts';
import { Trash2 } from 'lucide-react';
import { CreateSubCommentDialog } from './CreateSubCommentDialog';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { useUser } from '@clerk/nextjs';
import { ThumbsUp } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { deleteComment } from '@/lib/actions/deleteComment';
import { toast } from 'sonner';

interface PostActionsProps {
  comment: CommentType;
  userId: string | null;
}

export function PostActions({ comment, userId }: PostActionsProps) {
  const { isSignedIn } = useUser();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteComment = async () => {
    startTransition(async () => {
      setPopoverOpen(false);
      const response = await deleteComment(
        comment.author_clerk_user_id,
        comment.id,
        comment.post_id
      );
      if (response.success) {
        toast.success('Comment deleted successfully!');
      } else {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="flex items-center mt-4">
      <div className="flex flex-1 gap-4">
        <button>
          <ThumbsUp size={isLargeScreen ? 18 : 16} />
        </button>
        <CreateSubCommentDialog
          comment={comment}
          username={comment.username}
          usernameImage={comment.author_profile_image}
          userProfileImage={comment.author_profile_image}
          postId={comment.post_id.toString()}
        />
      </div>
      {comment.author_clerk_user_id === userId && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <Trash2
              className="text-red-500"
              size={isLargeScreen ? 18 : 16}
              onClick={(e) => setPopoverOpen(true)}
            />
          </PopoverTrigger>
          <PopoverContent>
            <h4 className="font-semibold mb-2">
              Are you sure you want to delete this post?
            </h4>

            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => setPopoverOpen(false)} variant="outline">
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
