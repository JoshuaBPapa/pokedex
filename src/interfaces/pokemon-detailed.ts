import { EvoPath } from './evo-path';
import { GenderPercentage } from './gender-percentage';
import { Pokemon } from './pokemon';

export interface PokemonDetailed extends Pokemon {
  animatedImgSrc: null | string;
  description: string;
  species: string;
  genderRatio: null | GenderPercentage;
  eggGroups: string[];
  evolutionPaths: EvoPath[][];
}
