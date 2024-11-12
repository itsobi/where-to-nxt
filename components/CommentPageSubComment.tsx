import {
  getSubCommentReplies,
  SubCommentType,
} from '@/lib/queries/getComments';
import { SignedIn } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { PostActions } from './PostActions';
import { CommentPageSubCommentDialog } from './CommentPageSubCommentDialog';
import { cn } from '@/lib/utils';

interface CommentPageSubCommentProps {
  subComment: SubCommentType;
  userId: string | null;
  postId: number;
  showVerticalLine?: boolean;
}

export async function CommentPageSubComment({
  subComment,
  userId,
  postId,
}: CommentPageSubCommentProps) {
  const subCommentReplies = await getSubCommentReplies(subComment.id);
  const isLastReply = subCommentReplies?.length === 0;

  return (
    <div className={cn('p-4', isLastReply && 'border-b')}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex flex-col items-center relative">
            <Avatar>
              <AvatarImage
                src={subComment.author_profile_image}
                alt={subComment.username}
              />
              <AvatarFallback>
                {subComment.username[0].toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{subComment.username}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(subComment.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {userId ? (
              <p className="text-sm lg:text-base">{subComment.content}</p>
            ) : (
              <div className="space-y-2 mt-1">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-[75%] h-4" />
              </div>
            )}

            <SignedIn>
              <div className="flex items-center gap-4 mt-2">
                <CommentPageSubCommentDialog
                  comment={subComment}
                  username={subComment.username}
                  usernameImage={subComment.author_profile_image}
                  userProfileImage={subComment.author_profile_image}
                  postId={postId}
                />
                {/* <PostActions comment={subComment} userId={userId} /> */}
              </div>
            </SignedIn>
          </div>
        </div>
      </div>

      {subCommentReplies && (
        <div className="flex flex-col gap-4 mt-4 border-gray-200">
          {subCommentReplies.map((reply, index) => (
            <CommentPageSubComment
              key={reply.id}
              subComment={reply}
              userId={userId}
              postId={postId}
              showVerticalLine
              // border={index === subCommentReplies.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
