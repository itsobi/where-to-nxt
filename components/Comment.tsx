import { CommentType } from '@/lib/queries/getPosts';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { PostActions } from './PostActions';
// import { getSubComments } from '@/lib/queries/getComments';
import { SubComments } from './SubComment';
import { SignedIn } from '@clerk/nextjs';
import { getReplies } from '@/lib/queries/getReplies';

interface CommentProps {
  comment: CommentType;
  userId: string | null;
}

export async function Comment({ comment, userId }: CommentProps) {
  const replies = await getReplies(comment.id);

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
            {userId ? (
              <p className="text-sm lg:text-base">{comment.content}</p>
            ) : (
              <div className="space-y-2 mt-1">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-[75%] h-4" />
              </div>
            )}
            <SignedIn>
              <PostActions comment={comment} userId={userId} />

              <SubComments
                replies={replies}
                commentId={comment.id.toString()}
                postId={comment.post_id.toString()}
              />
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
