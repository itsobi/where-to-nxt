import { formatDistanceToNow } from 'date-fns';

import { PostType } from '@/lib/queries/getPosts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { getCountry } from '@/lib/countries';
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';
import { Skeleton } from './ui/skeleton';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';

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

export function Post({ post }: { post: PostType }) {
  const { userId } = auth();
  const country = getCountry(post.country);

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
        <Avatar>
          <AvatarImage src={post.author_profile_image} alt={post.username} />
          <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
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
            <p className="text-sm lg:text-base">{post.post}</p>
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
                      <Image
                        src={image}
                        alt={`Post image ${index + 1}`}
                        width={500}
                        height={500}
                        className="rounded"
                      />
                    </div>
                  ))
                : Array.from({ length: post.images.length }).map((_, index) => (
                    <Skeleton key={index} className="w-full h-40 rounded" />
                  ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
