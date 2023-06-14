import { PokemonStat } from '../../interfaces';

interface Props {
  stats: PokemonStat[];
}

const PokemonStats: React.FC<Props> = ({ stats }) => {
  // the highest base stats found in the game from different pokemon
  // will be used to create a comparison percentage
  const bestBaseStats: { [key: string]: number } = {
    hp: 255,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180,
  };

  const content = stats.map((stat) => (
    <div key={stat.stat}>
      {stat.stat.replace('-', ' ').toUpperCase()}
      {(stat.value / bestBaseStats[stat.stat]) * 100}
      {stat.value}
    </div>
  ));

  return <div>{content}</div>;
};

export default PokemonStats;
