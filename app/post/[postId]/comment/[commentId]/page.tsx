import { CommentPageSubComment } from '@/components/CommentPageSubComment';
import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';
import { DottedSeparator } from '@/components/DottedSeparator';
import { PostActions } from '@/components/PostActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { getCommentById, getSubComments } from '@/lib/queries/getComments';
import { SignedIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';

export default async function MainCommentPage({
  params,
}: {
  params: { commentId: string };
}) {
  const { userId } = auth();
  const comment = await getCommentById(Number(params.commentId));
  const subComments = await getSubComments(Number(params.commentId));

  if (!comment) {
    return notFound();
  }

  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="border rounded shadow-md p-4 relative mb-4">
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={comment.author_profile_image}
                alt={comment.username}
              />
              <AvatarFallback>
                {comment.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{comment.username}</p>
                <p className="hidden lg:block text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground lg:hidden mb-1">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </p>
              {userId ? (
                <p className="text-sm lg:text-base">{comment.content}</p>
              ) : (
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-[75%] h-4" />
                </div>
              )}

              <div className="py-2" />
              <DottedSeparator />

              <SignedIn>
                <PostActions comment={comment} userId={userId} />
              </SignedIn>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold">Replies</h2>
        {subComments.map((subComment, index) => (
          <CommentPageSubComment
            key={subComment.id}
            subComment={subComment}
            userId={userId}
            postId={comment.post_id}
          />
        ))}
      </Container>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
