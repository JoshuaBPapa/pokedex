import { GenderPercentage } from './gender-percentage';

export interface SerialisedSpecies {
  description: string;
  eggGroups: string[];
  species: string;
  genderRatio: GenderPercentage | null;
  evolutionChain: string;
}
