import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';

export default function PostPage({ params }: { params: { postId: string } }) {
  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="h-full flex flex-col">
          <p>Post id: {params.postId}</p>
        </div>
      </Container>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
