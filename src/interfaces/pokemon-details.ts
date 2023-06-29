import { EvoPath } from './evo-path';
import { GenderPercentage } from './gender-percentage';

export interface PokemonDetails {
  description: string;
  species: string;
  genderRatio: null | GenderPercentage;
  eggGroups: string[];
  evolutionPaths: EvoPath[][];
}
