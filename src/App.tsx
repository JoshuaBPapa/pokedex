import { useState } from 'react';
import PokemonListContainer from './components/PokemonListContainer/PokemonListContainer';
import PokemonDetailedContainer from './components/PokemonDetailedContainer/PokemonDetailedContainer';
import { Pokemon } from './interfaces';
import './style/_index.scss';
import './App.scss';

const App: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<null | Pokemon>(null);

  return (
    <div className="pokedex-container">
      <div className="pokedex-case pokedex-case-first-half">
        <PokemonListContainer handleSelectedPokemon={setSelectedPokemon} />
      </div>
      <div className="pokedex-case pokedex-case-centre">
        <div className="pokedex-case-joint"></div>
        <div className="pokedex-case-joint"></div>
      </div>
      <div className="pokedex-case pokedex-case-second-half">
        <PokemonDetailedContainer selectedPokemon={selectedPokemon} />
      </div>
    </div>
  );
};

export default App;
