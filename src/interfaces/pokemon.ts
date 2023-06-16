import { PokemonMove, PokemonStat, PokemonType } from './index';

export interface Pokemon {
  id: number;
  order: number;
  name: string;
  types: PokemonType[];
  height: number;
  weight: number;
  stats: PokemonStat[];
  imgSrc: string;
  abilities: string[];
  levelUpMoves: PokemonMove[];
  taughtMoves: PokemonMove[];
}
