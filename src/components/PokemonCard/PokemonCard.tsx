import { getPokemonHashNumber, getPokemonTypecolours } from '../../helpers';
import typeBackgroundMap from '../../imgs/type-backgrounds';
import { Pokemon } from '../../interfaces';
import PokemonTypePill from '../PokemonTypePill/PokemonTypePill';
import pokemonImgErr from '../../imgs/pokemon-img-err.png';
import './PokemonCard.scss';

interface Props {
  pokemon: Pokemon;
  handleImageLoad: () => void;
}

const PokemonCard: React.FC<Props> = ({ pokemon, handleImageLoad }) => {
  const TypeBackgroundIcon = typeBackgroundMap[pokemon.types[0]];

  return (
    <div
      className="pokemon-card"
      style={{
        backgroundColor: getPokemonTypecolours(pokemon.types[0]).primarycolour,
      }}
    >
      <div className="pokemon-info">
        <div>
          <p>{getPokemonHashNumber(pokemon.id)}</p>
          <span className="pokemon-name">{pokemon.name}</span>
        </div>
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <PokemonTypePill key={type} type={type} />
          ))}
        </div>
      </div>
      <div className="card-images">
        <img
          src={pokemon.imgSrc}
          alt={pokemon.name}
          onLoad={handleImageLoad}
          className="pokemon-image"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = pokemonImgErr;
          }}
        />
        <div className="type-background-icon">
          <TypeBackgroundIcon />
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
