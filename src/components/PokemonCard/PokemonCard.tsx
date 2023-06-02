import { Pokemon } from '../../interfaces';

interface Props {
  pokemon: Pokemon;
  handleImageLoad: () => void;
}

const PokemonCard: React.FC<Props> = ({ pokemon, handleImageLoad }) => {
  return (
    <div>
      <p>{pokemon.name}</p>
      <img src={pokemon.imgSrc} alt={pokemon.name} onLoad={handleImageLoad} />
      <p>{pokemon.types}</p>
    </div>
  );
};

export default PokemonCard;
