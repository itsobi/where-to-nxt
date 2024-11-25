import { BackButton } from '@/components/BackButton';
import { CountryDropdown } from '@/components/CountryDropdown';
import { Post } from '@/components/Post';
import { getCountry } from '@/lib/countries';
import { getPostsByCountry } from '@/lib/queries/getPost';

interface CountryPagePostsProps {
  params: {
    countryCode: string;
  };
}

export default async function CountryPagePosts({
  params,
}: CountryPagePostsProps) {
  const posts = await getPostsByCountry(params.countryCode);
  const country = getCountry(params.countryCode);

  return (
    <>
      <div className="col-span-full lg:col-span-5">
        <BackButton label={country ? `${country.flag} ${country.name}` : ''} />
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <CountryDropdown className="hidden lg:block lg:col-span-2" />
    </>
  );
}
