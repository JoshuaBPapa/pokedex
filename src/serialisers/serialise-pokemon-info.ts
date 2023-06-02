import { Pokemon } from '../interfaces';

interface PokemonInfoRes {
  id: number;
  name: string;
  order: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
    version_group_details: {
      level_learned_at: number;
      move_learn_method: {
        name: string;
        url: string;
      };
      version_group: {
        name: string;
        url: string;
      };
    }[];
  }[];
}

export const serialisePokemonInfo = (pokemon: PokemonInfoRes): Pokemon => {
  const { id, order, name, height, weight } = pokemon;
  const abilities = pokemon.abilities.map(({ ability }) => ability.name);
  const imgSrc = pokemon.sprites.other['official-artwork'].front_default;
  const types = pokemon.types.map(({ type }) => type.name);
  const stats = pokemon.stats.map((stat) => {
    return {
      value: stat.base_stat,
      stat: stat.stat.name,
    };
  });
  const moves = pokemon.moves.map(({ move, version_group_details }) => {
    const { name } = move;
    const moveDetail = version_group_details[0];
    const level = moveDetail.level_learned_at;
    const method = moveDetail.move_learn_method.name;

    return {
      name,
      level,
      method,
    };
  });

  return {
    id,
    order,
    name,
    height,
    weight,
    abilities,
    imgSrc,
    types,
    moves,
    stats,
  };
};
