import { getCountries } from '@/lib/countries';
import { getCountryCounts } from '@/lib/queries/getPost';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

export async function PopularCountryList({ className }: { className: string }) {
  const data = await getCountryCounts(2);
  const countries = getCountries(data ?? []);

  return (
    <div className={className}>
      <div className="flex flex-col space-y-2 p-8 w-full">
        <div className="lg:text-lg font-semibold">Popular Countries</div>
        <SignedIn>
          {countries.length > 0 ? (
            countries.map((country) => (
              <Link
                key={country.name}
                href={`/country/${country.code}`}
                className="hover:bg-gray-100 rounded-md p-2 flex"
              >
                <div className="flex items-center space-x-2">
                  <p className="text-2xl lg:text-3xl">{country.flag}</p>
                  <p>{country.name}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No countries available.
              </p>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          {countries.length > 0
            ? countries.map((country) => (
                <Skeleton key={country.name} className="h-10 w-full" />
              ))
            : Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
        </SignedOut>
      </div>
    </div>
  );
}
