import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';
import { PostForm } from '@/components/PostForm';
export default async function HomePage() {
  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="h-full">
          <PostForm />
        </div>
      </Container>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
