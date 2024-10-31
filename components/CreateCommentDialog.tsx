'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { PostType } from '@/lib/queries/getPosts';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@clerk/nextjs/server';
import { Button } from './ui/button';
import { useRef, useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { createComment } from '@/lib/actions/createComment';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CreateCommentDialogProps {
  post: PostType;
  username: string | null;
  usernameImage: string | null;
  userProfileImage: string | null;
}

export function CreateCommentDialog({
  post,
  username,
  usernameImage,
  userProfileImage,
}: CreateCommentDialogProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setComment('');
    startTransition(async () => {
      const result = await createComment({
        postId: post.id,
        comment: comment,
        authorProfileImage: userProfileImage,
      });

      if (result.success) {
        toast.success(result.message);

        router.push(`/post/${post.id}`);
      } else {
        toast.error(result.message);
      }

      setIsDialogOpen(false);
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-primary-blue relative">
          <MessageCircle size={isLargeScreen ? 18 : 16} />
          {post.comment_count > 0 && (
            <span className="absolute -top-2 -right-2 text-xs text-black">
              {post.comment_count}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] rounded">
        <DialogHeader>
          <DialogTitle className="sr-only">Create Comment</DialogTitle>
        </DialogHeader>
        <div className="relative flex gap-2">
          <div className="absolute left-[20px] top-[40px] w-[2px] h-[calc(100%-40px)] bg-border" />
          <Avatar>
            <AvatarFallback>{post.username[0]}</AvatarFallback>
            <AvatarImage src={post.author_profile_image} />
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p>{post.username}</p>
              <p className="lg:block text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="text-sm lg:text-base">{post.post}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Avatar>
            <AvatarFallback>{username?.[0]}</AvatarFallback>
            <AvatarImage src={usernameImage || ''} />
          </Avatar>
          <div className="w-full flex flex-col lg:flex-row lg:items-start">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full mt-2 outline-none h-24 resize-none text-sm lg:text-base disabled:cursor-not-allowed bg-transparent"
              placeholder="Reply here"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              <span
                className={cn(
                  comment.length > 399 && 'text-yellow-400',
                  comment.length > 449 && 'text-red-400'
                )}
              >
                {comment.length}
              </span>
              /500 characters
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            variant="default"
            className="w-full"
            onClick={handleSubmit}
            disabled={comment.length === 0 || isPending}
          >
            Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
