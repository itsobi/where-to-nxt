import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';
import { Post } from '@/components/Post';
import { PostForm } from '@/components/PostForm';
import { getPosts } from '@/lib/queries/getPosts';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="h-full flex flex-col">
          <PostForm />
          {posts.length ? (
            posts.map((post) => <Post key={post.id} post={post} linkToPost />)
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold">No posts yet.</p>
            </div>
          )}
        </div>
      </Container>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
