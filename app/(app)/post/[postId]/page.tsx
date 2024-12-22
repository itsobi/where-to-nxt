import { BackButton } from '@/components/BackButton';
import { Comment } from '@/components/Comment';
import { Container } from '@/components/Container';
import { PopularCountryList } from '@/components/PopularCountryList';
import { CustomAlertDialog } from '@/components/CustomAlertDialog';
import { Post } from '@/components/Post';
import { getComments } from '@/lib/queries/getComments';
import { getPost } from '@/lib/queries/getPost';
import { auth } from '@clerk/nextjs/server';

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  const { userId } = await auth();
  const post = await getPost(postId);
  const comments = await getComments(postId);

  if (!post) {
    return (
      <CustomAlertDialog
        title="Post not found"
        description="This post does not exist. You will be redirected to the home page."
        href="/"
      />
    );
  }

  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <BackButton label="Post" />
        <div className="h-full flex flex-col">
          <Post post={post} />

          {comments?.length ? (
            <>
              <h2 className="text-lg font-semibold">Comments</h2>
              {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} userId={userId} />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold">No comments.</p>
            </div>
          )}
        </div>
      </Container>
      <PopularCountryList className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
