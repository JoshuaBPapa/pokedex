import { GenderPercentage, NameUrlPairing } from '../interfaces';
import { SerialisedSpecies } from '../interfaces/serialised-species';

interface Genus {
  genus: string;
  language: NameUrlPairing;
}

interface FlavorTextEntries {
  flavor_text: string;
  language: NameUrlPairing;
  version: NameUrlPairing;
}

interface PokemonSpeciesRes {
  id: number;
  egg_groups: NameUrlPairing[];
  flavor_text_entries: FlavorTextEntries[];
  genera: Genus[];
  gender_rate: number;
  evolution_chain: {
    url: string;
  };
}

const getGenderPercentage = (genderRate: number): null | GenderPercentage => {
  // PokeAPI determines genderless pokemon with -1
  if (!genderRate || genderRate === -1) return null;
  if (genderRate === 0) return { male: 100, female: 0 };
  // PokeAPI determines the chance of a pokemon being female in eighths
  const female = 100 / (8 / genderRate);
  const male = 100 - female;

  return { male, female };
};

const getSpecies = (genera: Genus[]): string => {
  const engText = genera.find((genus) => genus.language.name === 'en');
  return engText ? engText.genus : 'N/A';
};

const getDescription = (textEntries: FlavorTextEntries[]): string => {
  const engText = textEntries.find((entry) => entry.language.name === 'en');
  if (!engText) return 'Description not found.';
  // remove any escape sequences found in PokeAPI
  return engText.flavor_text.replace(/\n/g, ' ').replace(/\f/g, ' ');
};

export const serialisePokemonSpecies = (speciesRes: PokemonSpeciesRes): SerialisedSpecies => {
  const genderRatio = getGenderPercentage(speciesRes.gender_rate);
  const species = getSpecies(speciesRes.genera);
  const description = getDescription(speciesRes.flavor_text_entries);
  const eggGroups = speciesRes.egg_groups.map((group) => group.name.replace('-', ' '));
  const evolutionChain = speciesRes.evolution_chain.url;

  return { genderRatio, species, description, eggGroups, evolutionChain };
};
