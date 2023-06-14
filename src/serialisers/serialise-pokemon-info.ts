import { NameUrlPairing, Pokemon, PokemonMove } from '../interfaces';

interface PokemonInfoMovesRes {
  move: NameUrlPairing;
  version_group_details: {
    level_learned_at: number;
    move_learn_method: NameUrlPairing;
    version_group: NameUrlPairing;
  }[];
}

interface PokemonInfoRes {
  id: number;
  name: string;
  order: number;
  types: {
    slot: number;
    type: NameUrlPairing;
  }[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: NameUrlPairing;
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  abilities: {
    ability: NameUrlPairing;
    is_hidden: boolean;
    slot: number;
  }[];
  moves: PokemonInfoMovesRes[];
}

const serialisePokemonMoves = (
  moves: PokemonInfoMovesRes[]
): { levelUpMoves: PokemonMove[]; taughtMoves: PokemonMove[] } => {
  const unSortedLevelUpMoves: PokemonMove[] = [];
  const unSortedTaughtMoves: PokemonMove[] = [];

  moves.forEach(({ move, version_group_details }) => {
    const { name } = move;
    const moveDetail = version_group_details[0];
    const level = moveDetail.level_learned_at;
    const method = moveDetail.move_learn_method.name;

    const moveToAdd = {
      name,
      level,
      method,
    };

    if (level) unSortedLevelUpMoves.push(moveToAdd);
    else unSortedTaughtMoves.push(moveToAdd);
  });

  const levelUpMoves = unSortedLevelUpMoves.sort((a, b) => a.level - b.level);
  const taughtMoves = unSortedTaughtMoves.sort((a, b) => a.method.localeCompare(b.method));

  return { levelUpMoves, taughtMoves };
};

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
  const { levelUpMoves, taughtMoves } = serialisePokemonMoves(pokemon.moves);

  return {
    id,
    order,
    name,
    height,
    weight,
    abilities,
    imgSrc,
    types,
    levelUpMoves,
    taughtMoves,
    stats,
  };
};
