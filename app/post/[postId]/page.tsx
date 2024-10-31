import { Comment } from '@/components/Comment';
import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';
import { Post } from '@/components/Post';
import { getPost } from '@/lib/queries/getPost';

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const post = await getPost(params.postId);

  console.log('POST >>>', post);

  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="h-full flex flex-col">
          <Post post={post} />

          {post.comments.length ? (
            post.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold">No comments yet.</p>
            </div>
          )}
        </div>
      </Container>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
