import { getPokemonTypecolours } from '../../helpers';
import typeIconMap from '../../imgs/type-icons';
import { PokemonType } from '../../interfaces';
import './PokemonTypePill.scss';

interface Props {
  type: PokemonType;
}

const PokemonTypePill: React.FC<Props> = ({ type }) => {
  const TypeIcon = typeIconMap[type];

  return (
    <div
      className="pokemon-type-pill"
      style={{ backgroundColor: getPokemonTypecolours(type).secondarycolour }}
    >
      <div className="type-icon-container">
        <TypeIcon />
      </div>
      <span className="type">{type}</span>
    </div>
  );
};

export default PokemonTypePill;
