import 'dotenv/config';
import { City, PrismaClient } from '@generated/prisma/client';
import data from '@/static-seed/countries-states-cities.json';
import { chunk } from '@/utils/chunk.utils';

type CitySeed = {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
  timezone: string;
};

type StateSeed = {
  id: number;
  name: string;
  iso2: string;
  iso3166_2: string;
  native: string;
  latitude: string;
  longitude: string;
  type: string;
  timezone: string;
  cities: CitySeed[];
};

type CountrySeed = {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phonecode: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  population: number;
  region: string;
  region_id: number;
  subregion: string;
  subregion_id: number;
  nationality: string;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
  states: StateSeed[];
};

const countries = data as CountrySeed[];
const BATCH_SIZE = 1000;

export async function seedCountries(prisma: PrismaClient) {
  const start = performance.now();
  console.log('🌍 Seeding countries...');

  // 1. Countries
  await prisma.country.createMany({
    data: countries.map((country) => {
      return {
        id: country.id,
        name: country.name,
        code: country.iso2,
        phonecode: country.phonecode,
        currency: country.currency,
        currencyName: country.currency_name,
        currencySymbol: country.currency_symbol,
        latitude: Number(country.latitude),
        longitude: Number(country.longitude),
        emoji: country.emoji,
      };
    }),
    skipDuplicates: true,
  });
  console.log(`✅ Countries: ${countries.length}`);

  // 2. States
  const states = countries.flatMap((country) =>
    country.states.map((state) => ({
      id: state.id,
      name: state.name,
      countryId: country.id,
    })),
  );

  await prisma.countryState.createMany({
    data: states,
    skipDuplicates: true,
  });
  console.log(`✅ States: ${states.length}`);

  // 3. Cities
  const cities = countries.flatMap((country) =>
    country.states.flatMap((state) =>
      state.cities.map((city) => ({
        id: city.id,
        name: city.name,
        latitude: city.latitude ? Number(city.latitude) : null,
        longitude: city.longitude ? Number(city.longitude) : null,
        countryStateId: state.id,
        countryId: country.id,
      })),
    ),
  );
  console.log(`🏙️ Cities: ${cities.length}`);

  // 4. Insert cities in batches
  const batches = chunk(cities, BATCH_SIZE);

  for (const batch of batches.entries()) {
    await prisma.city.createMany({
      data: batch[1] as unknown as City,
      skipDuplicates: true,
    });
  }

  console.log('🎉 Countries, states and cities seeded');

  const elapsed = performance.now() - start;

  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  console.log(`Execution time: ${minutes}m ${seconds}s`);
}
