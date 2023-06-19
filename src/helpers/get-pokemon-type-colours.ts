import { PokemonType } from '../interfaces';

interface PokemonTypeColours {
  primarycolour: string;
  secondarycolour: string;
}

const pokemonTypeColoursMap: { [key in PokemonType]: PokemonTypeColours } = {
  water: {
    primarycolour: '#5090d6',
    secondarycolour: '#5fabff',
  },
  dragon: {
    primarycolour: '#0b6dc3',
    secondarycolour: '#0e8cfb',
  },
  electric: {
    primarycolour: '#dab617',
    secondarycolour: '#dcbb29',
  },
  fairy: {
    primarycolour: '#ec8fe6',
    secondarycolour: '#ffa8f9',
  },
  ghost: {
    primarycolour: '#5269ad',
    secondarycolour: '#708fed',
  },
  fire: {
    primarycolour: '#f9832d',
    secondarycolour: '#ff9e57',
  },
  ice: {
    primarycolour: '#73cec0',
    secondarycolour: '#39c6b0',
  },
  grass: {
    primarycolour: '#63bc5a',
    secondarycolour: '#78d26e',
  },
  bug: {
    primarycolour: '#91c12f',
    secondarycolour: '#aae13a',
  },
  fighting: {
    primarycolour: '#ce416b',
    secondarycolour: '#ff5588',
  },
  normal: {
    primarycolour: '#676e75',
    secondarycolour: '#9ba5ae',
  },
  dark: {
    primarycolour: '#5a5465',
    secondarycolour: '#8a809d',
  },
  steel: {
    primarycolour: '#5a8ea2',
    secondarycolour: '#76bad4',
  },
  rock: {
    primarycolour: '#9a8f6b',
    secondarycolour: '#ceb66c',
  },
  psychic: {
    primarycolour: '#c15960',
    secondarycolour: '#fa7179',
  },
  ground: {
    primarycolour: '#d97845',
    secondarycolour: '#ff9259',
  },
  poison: {
    primarycolour: '#b567ce',
    secondarycolour: '#d376f1',
  },
  flying: {
    primarycolour: '#89aae3',
    secondarycolour: '#9fc2ff',
  },
};

export const getPokemonTypecolours = (type: PokemonType): PokemonTypeColours => {
  return pokemonTypeColoursMap[type];
};
