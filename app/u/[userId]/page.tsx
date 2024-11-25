import { BackButton } from '@/components/BackButton';
import { CountryDropdown } from '@/components/CountryDropdown';
import { Post } from '@/components/Post';
import { getPostsByUserId } from '@/lib/queries/getPost';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface UserPostPageProps {
  params: {
    userId: string;
  };
}

export default async function UserPostPage({ params }: UserPostPageProps) {
  const { userId } = auth();
  const posts = await getPostsByUserId(params.userId);

  if (!userId) {
    redirect('/');
  }

  return (
    <>
      <div className="col-span-full lg:col-span-5">
        <BackButton label={posts?.[0]?.username || 'User'} />
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
