import { BackButton } from '@/components/BackButton';
import { PopularCountryList } from '@/components/PopularCountryList';
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
  const { countryCode } = await params;
  const posts = await getPostsByCountry(countryCode);
  const country = getCountry(countryCode);

  return (
    <>
      <div className="col-span-full lg:col-span-5">
        <BackButton label={country ? `${country.flag} ${country.name}` : ''} />
        {posts?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <PopularCountryList className="hidden lg:block lg:col-span-2" />
    </>
  );
}
