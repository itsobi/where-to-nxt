import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default async function HomePage() {
  return (
    <>
      <Container className="">
        <div className="bg-red-300 h-full">
          <p>hello</p>
        </div>
      </Container>
      {/* <CountryDropdown /> */}
    </>
  );
}
