import { Fragment, ReactNode, useEffect, useState } from 'react';
import { EvoPath, Pokemon, PokemonDetails, SerialisedSpecies } from '../../interfaces';
import { useWaitForImgsLoad, useFetchChained } from '../../hooks';
import { serialiseEvolutionTree, serialisePokemonSpecies } from '../../serialisers';
import InfoTabsContainer from '../InfoTabsContainer/InfoTabsContainer';
import PokemonAbout from '../PokemonAbout/PokemonAbout';
import PokemonMovesTable from '../PokemonMovesTable/PokemonMovesTable';
import PokemonEvolutionPaths from '../PokemonEvolutionPaths/PokemonEvolutionPaths';
import PokemonStats from '../PokemonStats/PokemonStats';
import PokedexScreen from '../PokedexScreen/PokedexScreen';
import { getPokemonTypecolours } from '../../helpers';
import PokemonTypePill from '../PokemonTypePill/PokemonTypePill';
import pokemonImgErr from '../../imgs/pokemon-img-err.png';
import './PokemonDetailedContainer.scss';

const getAnimatedImgSrc = (id: number, name: string): string | null => {
  // source for pokemon gifs - only has gifs for pokemon up to #0898
  if (id > 898) return null;
  const baseUrl = 'https://www.smogon.com/dex/media/sprites/xy/';
  return `${baseUrl}${name.toLowerCase()}.gif`;
};

interface Props {
  selectedPokemon: null | Pokemon;
}

const PokemonDetailedContainer: React.FC<Props> = ({ selectedPokemon }) => {
  const [pokemonDetails, setPokemonDetails] = useState<null | PokemonDetails>(null);
  const { allImgsLoaded, handleImgLoad, resetImgsLoadCheck } = useWaitForImgsLoad();
  const { setFetchChain, loading, error, data } = useFetchChained();

  useEffect(() => {
    if (!selectedPokemon) return;
    resetImgsLoadCheck(1);
    setFetchChain([
      {
        buildUrl: () => `https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.id}`,
        serialiser: serialisePokemonSpecies,
        buildNextParams: (data: SerialisedSpecies) => ({ evoChainUrl: data.evolutionChain }),
      },
      {
        buildUrl: (params) => params && params.evoChainUrl,
        serialiser: serialiseEvolutionTree,
      },
    ]);
  }, [selectedPokemon, setFetchChain, resetImgsLoadCheck]);

  useEffect(() => {
    if (!data) return;
    const [speciesData, evolutionPaths]: [SerialisedSpecies, EvoPath[][]] = data;
    const { description, species, genderRatio, eggGroups } = speciesData;
    const detailed: PokemonDetails = {
      description,
      species,
      genderRatio,
      eggGroups,
      evolutionPaths,
    };
    setPokemonDetails(detailed);
  }, [data]);

  const typeColours = selectedPokemon && getPokemonTypecolours(selectedPokemon.types[0]);
  const primaryColour = typeColours ? typeColours.primarycolour : '#8A809D';
  const secondaryColour = typeColours ? typeColours.primarycolour : '#59bae9';

  let content: string | ReactNode = 'Select a Pokémon from the list';
  if (loading) content = 'loading...';
  else if (pokemonDetails && selectedPokemon) {
    const infoTabs = [
      {
        label: 'About',
        content: (
          <PokemonAbout
            species={pokemonDetails.species}
            abilities={selectedPokemon.abilities}
            genderRatio={pokemonDetails.genderRatio}
            eggGroups={pokemonDetails.eggGroups}
          />
        ),
      },
      {
        label: 'Description',
        content: pokemonDetails.description,
      },
      {
        label: 'Moves',
        content: (
          <PokemonMovesTable
            taughtMoves={selectedPokemon.taughtMoves}
            levelUpMoves={selectedPokemon.levelUpMoves}
            bgColour={primaryColour}
          />
        ),
      },
      {
        label: 'Evolution Paths',
        content: (
          <PokemonEvolutionPaths
            evolutionPaths={pokemonDetails.evolutionPaths}
            bgColour={primaryColour}
          />
        ),
      },
    ];

    content = (
      <Fragment>
        {!allImgsLoaded && 'loading image'}
        <div className={allImgsLoaded ? 'pokemon-details' : 'display-none'}>
          <span className="pokemon-name">{selectedPokemon.name}</span>
          <div className="pokemon-overview">
            <img
              className="pokemon-image"
              src={
                getAnimatedImgSrc(selectedPokemon.id, selectedPokemon.name) ||
                selectedPokemon.imgSrc
              }
              alt={selectedPokemon.name}
              onLoad={handleImgLoad}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = pokemonImgErr;
              }}
            />
            <PokemonStats stats={selectedPokemon.stats} barColour={secondaryColour} />
            <div className="pokemon-extra-info">
              <div className="pokemon-types">
                {selectedPokemon.types.map((type) => (
                  <PokemonTypePill key={type} type={type} />
                ))}
              </div>
              <div className="pokemon-measurements">
                <span className="measurement-title">Height:</span> {selectedPokemon.height * 10} cm
                <span className="measurement-title">Weight:</span> {selectedPokemon.weight / 10} kg
              </div>
            </div>
          </div>
          <InfoTabsContainer config={infoTabs} />
        </div>
      </Fragment>
    );
  }

  const screenBackground =
    typeColours && !loading && allImgsLoaded
      ? `linear-gradient(315deg, ${typeColours.primarycolour} 10%, ${typeColours.secondarycolour} 90%)`
      : '';

  return (
    <PokedexScreen
      styleProps={{
        height: '100%',
        padding: '20px',
        overflow: 'auto',
        background: screenBackground,
      }}
    >
      {content}
    </PokedexScreen>
  );
};

export default PokemonDetailedContainer;
