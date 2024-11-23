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

import { CommentType, PostType } from '@/lib/queries/getPosts';
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
import { ReplyType } from '@/lib/queries/getComments';
import { createReply } from '@/lib/actions/createReply';

interface SubReplyDialogProps {
  reply: ReplyType;
  postId: string;
}

export function SubReplyDialog({ reply, postId }: SubReplyDialogProps) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async () => {
    setContent('');
    startTransition(async () => {
      const result = await createReply({
        commentId: reply.comment_id,
        content: content,
        authorProfileImage: reply.author_profile_image,
        username: reply.username,
        postId: postId,
        parentReplyId: reply.id,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        console.log('ERROR >>>', result.message);
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
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] rounded">
        <DialogHeader>
          <DialogTitle className="sr-only">Create Comment</DialogTitle>
        </DialogHeader>
        <div className="relative flex gap-2">
          <div className="absolute left-[20px] top-[40px] w-[2px] h-[calc(100%-40px)] bg-border" />
          <Avatar>
            <AvatarFallback>{reply.username}</AvatarFallback>
            <AvatarImage src={reply.author_profile_image} />
          </Avatar>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <p>{reply.username}</p>
              <p className="lg:block text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(reply.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <p className="text-sm lg:text-base">{reply.content}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Avatar>
            <AvatarFallback>{reply.username[0]}</AvatarFallback>
            <AvatarImage src={reply.author_profile_image || ''} />
          </Avatar>
          <div className="w-full flex flex-col lg:flex-row lg:items-start">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-2 outline-none h-24 resize-none text-sm lg:text-base disabled:cursor-not-allowed bg-transparent"
              placeholder="Reply here"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              <span
                className={cn(
                  content.length > 399 && 'text-yellow-400',
                  content.length > 449 && 'text-red-400'
                )}
              >
                {content.length}
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
            disabled={content.length === 0 || isPending}
          >
            Reply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
