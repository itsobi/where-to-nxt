'use client';

import { formatDistanceToNow } from 'date-fns';

import { PostType } from '@/lib/queries/getPosts';
import { getCountry } from '@/lib/countries';

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Skeleton } from './ui/skeleton';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { useAuth } from '@clerk/nextjs';
import { DottedSeparator } from './DottedSeparator';
import { ThumbsUp, Trash2 } from 'lucide-react';
import { useMediaQuery } from '@/lib/hooks';
import { Button } from './ui/button';
import { deletePost } from '@/lib/actions/deletePost';
import { toast } from 'sonner';
import { likePost } from '@/lib/actions/like-actions';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { CreateCommentOnPostDialog } from './CreateCommentDialog';
import { UserAvatarPopover } from './UserAvatarPopover';

const getGridClass = (imageCount: number) => {
  switch (imageCount) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-2';
    case 3:
      return 'grid-cols-2';
    case 4:
      return 'grid-cols-2';
    case 5:
      return 'grid-cols-3';
    default:
      return 'grid-cols-1';
  }
};

interface PostProps {
  post: PostType;
  linkToPost?: boolean;
  hidePostActions?: boolean;
}

export function Post({ post, linkToPost = false }: PostProps) {
  const { userId } = useAuth();
  const country = getCountry(post.country);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [isPending, startTransition] = useTransition();
  const alreadyLiked =
    post.id && post.liked_by.some((like) => like.clerk_user_id === userId);

  const handleImageClick = (e: React.MouseEvent, image: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleDeletePost = async () => {
    startTransition(async () => {
      setPopoverOpen(false);
      const response = await deletePost(post.id, post.images);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    });
  };

  const handleLikePost = async () => {
    startTransition(async () => {
      const response = await likePost({
        alreadyLiked: !!alreadyLiked,
        postId: post.id,
        userId: userId,
        postAuthorId: post.author_clerk_user_id,
      });

      if (!response.success) {
        toast.error(response.message);
      }
    });
  };

  return (
    <div className="border rounded shadow-md p-4 relative mb-4">
      {country && (
        <TooltipProvider delayDuration={5}>
          <Tooltip>
            <TooltipTrigger className="absolute top-0 right-2 lg:top-1">
              <p className="text-2xl lg:text-3xl">{country.flag}</p>
            </TooltipTrigger>
            <TooltipContent side="top">{country.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex gap-2">
        <div className="p-1">
          <UserAvatarPopover
            author_clerk_user_id={post.author_clerk_user_id}
            author_username={post.username}
            author_profile_image={post.author_profile_image}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{post.username}</p>
            <p className="hidden lg:block text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
          <p className="text-sm text-muted-foreground lg:hidden mb-1">
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </p>
          {userId ? (
            <p className="text-sm lg:text-base">{post.content}</p>
          ) : (
            <div className="space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-[75%] h-4" />
            </div>
          )}

          {post.images && (
            <div
              className={`grid ${getGridClass(post.images.length)} gap-2 mt-4`}
            >
              {userId
                ? post.images.map((image, index) => (
                    <div key={index} className="flex items-center">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Image
                            src={image}
                            alt={`Post image ${index + 1}`}
                            width={500}
                            height={500}
                            className="rounded cursor-pointer"
                            onClick={(e) => handleImageClick(e, image)}
                          />
                        </DialogTrigger>
                        <DialogContent className="border-none bg-transparent">
                          <DialogTitle className="sr-only">
                            Post Image
                          </DialogTitle>
                          <Image
                            src={selectedImage || ''}
                            alt="Full screen image"
                            width={800}
                            height={800}
                            className="rounded"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))
                : Array.from({ length: post.images.length }).map((_, index) => (
                    <Skeleton key={index} className="w-full h-40 rounded" />
                  ))}
            </div>
          )}

          <div className="py-2" />
          <DottedSeparator />

          {userId && (
            <div className="py-2 flex items-center space-x-8 mt-2">
              <div className="flex items-center flex-1 gap-x-4">
                <button
                  disabled={isPending}
                  onClick={handleLikePost}
                  className="hover:text-white relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ThumbsUp
                    size={isLargeScreen ? 18 : 16}
                    className={cn(
                      'text-black hover:text-green-400',
                      alreadyLiked && 'text-green-400'
                    )}
                  />
                  {post.liked_by.length > 0 && (
                    <span className="absolute -top-2 -right-2 text-xs text-black">
                      {post.liked_by.length}
                    </span>
                  )}
                </button>

                <CreateCommentOnPostDialog post={post} />

                {linkToPost && (
                  <Link
                    href={`/post/${post.id}`}
                    className="hover:underline underline-offset-2"
                  >
                    <span className="text-xs lg:text-sm">Go To Post</span>
                  </Link>
                )}
              </div>
              {post.author_clerk_user_id === userId && (
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
                        className="bg-gray-100 hover:bg-gray-200 hover:text-black"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeletePost}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
