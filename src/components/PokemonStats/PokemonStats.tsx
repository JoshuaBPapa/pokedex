import { PokemonStat } from '../../interfaces';
import './PokemonStats.scss';

interface Props {
  stats: PokemonStat[];
  barColour: string;
}

const PokemonStats: React.FC<Props> = ({ stats, barColour }) => {
  const largestVal = stats.reduce((a, stat) => Math.max(a, stat.value), -Infinity);

  const content = stats.map((stat) => (
    <div key={stat.stat} className="stat">
      <span>{stat.stat.replace('-', ' ').toUpperCase()}</span>
      <div className="stat-bar-container">
        <div
          className="stat-bar"
          style={{
            backgroundColor: barColour,
            width: Math.floor((stat.value / largestVal) * 100) + '%',
          }}
        >
          {stat.value}
        </div>
      </div>
    </div>
  ));

  return <div className="pokemon-stats-container">{content}</div>;
};

export default PokemonStats;
