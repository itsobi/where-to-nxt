'use client';

import { CommentType } from '@/lib/queries/getPosts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import {
  MessageCircle,
  ThumbsUp,
  Trash,
  Trash2,
  TrashIcon,
} from 'lucide-react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useTransition } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteComment } from '@/lib/actions/deleteComment';
import { CreateCommentDialog } from './CreateCommentDialog';
import { CreateSubCommentDialog } from './CreateSubCommentDialog';

interface CommentProps {
  comment: CommentType;
  userId: string | null;
}

export function Comment({ comment, userId }: CommentProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  console.log('COMMENT >>>', comment);

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
    <div className="border-b p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage
              src={comment.author_profile_image}
              alt={comment.username}
            />
            <AvatarFallback>
              {comment.username[0].toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{comment.username}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="text-sm lg:text-base">{comment.content}</p>
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
                      <Button
                        onClick={() => setPopoverOpen(false)}
                        variant="outline"
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
          </div>
        </div>
      </div>
    </div>
  );
}
