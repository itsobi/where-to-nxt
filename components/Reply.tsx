import { ReplyType } from '@/lib/queries/getComments';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';

interface ReplyProps {
  reply: ReplyType;
  userId: string | null;
}

export function Reply({ reply, userId }: ReplyProps) {
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
                {reply.username.toLocaleUpperCase()}
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
          </div>
        </div>
      </div>
    </div>
  );
}
