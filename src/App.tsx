import { useState } from 'react';
import PokemonListContainer from './components/PokemonListContainer/PokemonListContainer';
import PokemonDetailedContainer from './components/PokemonDetailedContainer/PokemonDetailedContainer';
import { Pokemon } from './interfaces';
import './style/_index.scss';

const App: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<null | Pokemon>(null);

  return (
    <div>
      <PokemonDetailedContainer selectedPokemon={selectedPokemon} />
      <PokemonListContainer handleSelectedPokemon={setSelectedPokemon} />
    </div>
  );
};

export default App;
