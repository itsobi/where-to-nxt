import { BackButton } from '@/components/BackButton';
import { PopularCountryList } from '@/components/PopularCountryList';
import { Post } from '@/components/Post';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPostsByUserId } from '@/lib/queries/getPost';
import { getUserById } from '@/lib/queries/getUser';
import { CalendarIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function UserPostPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;

  if (!userId) {
    redirect('/');
  }

  const posts = await getPostsByUserId(userId);
  const user = await getUserById(userId);

  return (
    <>
      <div className="col-span-full lg:col-span-5">
        <BackButton label={posts?.[0]?.username || 'User'} />

        <div className="w-full border rounded-lg shadow-sm bg-white dark:bg-gray-900 p-4 mb-4">
          <div className="flex justify-between items-start mb-6">
            <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-900">
              <AvatarImage
                src={user?.imageUrl || ''}
                alt={user?.username || ''}
              />
              <AvatarFallback>
                {user?.username?.[0].toUpperCase() || ''}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <h1 className="text-xl font-semibold">{user?.username}</h1>
            {(user?.publicMetadata?.is_pro as boolean) && (
              <span className="text-xs text-primary-blue font-bold">PRO</span>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Joined{' '}
              {new Date(user?.createdAt || '').toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <PopularCountryList className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
