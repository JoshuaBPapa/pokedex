import { PokemonMove, PokemonStat } from './index';

export interface Pokemon {
  id: number;
  order: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  stats: PokemonStat[];
  imgSrc: string;
  abilities: string[];
  moves: PokemonMove[];
}
