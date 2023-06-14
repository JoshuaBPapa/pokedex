import { NameUrlPairing } from '../interfaces';

interface GetPokemonNamesRes {
  count: number;
  next: string;
  previous: null;
  results: NameUrlPairing[];
}

export const serialisePokemonNames = (data: GetPokemonNamesRes): string[] => {
  return data.results.map((pokemon: any) => pokemon.name);
};
