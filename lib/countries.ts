'server only';

import countries, { Country } from 'world-countries';

// Helper function to group countries by region
const groupByRegion = (countries: Country[]) => {
  const regions: Record<string, { label: string; value: string }[]> = {};

  countries.forEach((country) => {
    const region = country.region || 'Others'; // Handle any missing regions

    if (!regions[region]) {
      regions[region] = [];
    }

    regions[region].push({
      label: `${country.flag || ''} ${country.name.common}`,
      value: country.cca2,
    });
  });

  return Object.entries(regions).map(([region, options]) => ({
    label: region,
    options,
  }));
};

export const groupedCountries = groupByRegion(countries);

export const getCountry = (code: string) => {
  const country = countries.find((country) => country.cca2 === code);
  if (country) {
    return {
      name: country.name.common,
      flag: country.flag || '',
      code: country.cca2,
    };
  }
  return false;
};

type CountryCode = {
  country: string;
};

export type CountryResult = {
  name: string;
  flag: string;
  code: string;
};

export const getCountries = (countryCodes: CountryCode[]): CountryResult[] => {
  // Create a Set of unique country codes first
  const uniqueCodes = [...new Set(countryCodes.map((code) => code.country))];

  return uniqueCodes
    .map((code) => getCountry(code))
    .filter((country): country is CountryResult => country !== null);
};
