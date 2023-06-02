import { useState } from 'react';
import PokemonListContainer from './components/PokemonListContainer/PokemonListContainer';

const App: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<null | string>(null);

  return (
    <div>
      <PokemonListContainer handleSelectedPokemon={setSelectedPokemon} />
    </div>
  );
};

export default App;
