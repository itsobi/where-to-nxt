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
    };
  }
  return false;
};
