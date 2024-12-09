import { Container } from '@/components/Container';
import { PopularCountryList } from '@/components/PopularCountryList';
import { NotificationFeed } from '@/components/NotifcationFeed';
import { Post } from '@/components/Post';
import { PostForm } from '@/components/PostForm';
import { getPosts } from '@/lib/queries/getPosts';
import { isCurrentUserPro } from '@/lib/queries/getProUser';
import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {
  const posts = await getPosts();
  const { userId } = await auth();
  const isProMember = await isCurrentUserPro(userId);

  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="h-full flex flex-col">
          {isProMember && (
            <div className="flex items-center justify-end pb-2">
              <NotificationFeed />
            </div>
          )}
          <PostForm />
          {posts.length ? (
            posts.map((post) => <Post key={post.id} post={post} linkToPost />)
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-lg font-semibold">No posts</p>
            </div>
          )}
        </div>
      </Container>
      <PopularCountryList className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
