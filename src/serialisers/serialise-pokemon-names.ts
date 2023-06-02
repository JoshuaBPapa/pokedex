interface GetPokemonNamesRes {
  count: number;
  next: string;
  previous: null;
  results: {
    name: string;
    url: string;
  }[];
}

export const serialisePokemonNames = (data: GetPokemonNamesRes): string[] => {
  return data.results.map((pokemon: any) => pokemon.name);
};
