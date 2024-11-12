import { Container } from '@/components/Container';
import { CountryDropdown } from '@/components/CountryDropdown';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const features = [
  {
    description: 'Access to direct messaging',
  },
  {
    description: '24/7 customer support',
  },
  {
    description: 'Enabled notifications',
  },
  {
    description: 'Pro badge on your profile',
  },
];

export default function MessagesPage() {
  return (
    <>
      <Container className="col-span-full lg:col-span-5">
        <div className="flex flex-col justify-center items-center">
          <div className="text-center space-y-2 mb-16">
            <h1 className="text-xl lg:text-2xl font-semibold text-primary-blue">
              Ooops, it looks like you are not subscribed to Pro!
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Subscribe to Pro to unlock direct messaging and start connecting
              with people from all over the world!
            </p>
          </div>

          {/* Pro Card */}
          <div className="border p-4 rounded-lg shadow-md max-w-[400px]">
            <div className="mb-8">
              <div className="border rounded-lg bg-primary-blue px-4 w-fit mb-4">
                <p className="text-white">Pro</p>
              </div>

              <p className="text-muted-foreground text-sm lg:text-base">
                Subscribe to Pro to unlock direct messaging and start connecting
                with people from all over the world!
              </p>
            </div>

            <h2 className="text-primary-blue text-4xl font-thin">
              $5.99
              <span className="text-sm text-muted-foreground">/month</span>
            </h2>

            <hr className="my-4" />

            {/* Features */}
            <ul className="space-y-2">
              {features.map((feature) => (
                <li
                  key={feature.description}
                  className="text-muted-foreground text-sm lg:text-base flex items-center gap-2"
                >
                  <Check /> {feature.description}
                </li>
              ))}
            </ul>

            <hr className="my-4" />

            <Button className="w-full">Subscribe</Button>
          </div>
        </div>
      </Container>
      <CountryDropdown className="hidden lg:inline-grid lg:col-span-2" />
    </>
  );
}
