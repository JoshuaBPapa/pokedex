import { Fragment, ReactNode, useEffect, useState } from 'react';
import { EvoPath, Pokemon, PokemonDetailed } from '../../interfaces';
import { useFetch, useWaitForImgsLoad } from '../../hooks';
import { SerialisedSpecies } from '../../interfaces/serialised-species';
import { serialiseEvolutionTree, serialisePokemonSpecies } from '../../serialisers';
import InfoTabsContainer from '../InfoTabsContainer/InfoTabsContainer';
import PokemonAbout from '../PokemonAbout/PokemonAbout';
import PokemonMovesTable from '../PokemonMovesTable/PokemonMovesTable';
import PokemonEvolutionPaths from '../PokemonEvolutionPaths/PokemonEvolutionPaths';
import PokemonStats from '../PokemonStats/PokemonStats';

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
  const [pokemonDetailed, setPokemonDetailed] = useState<null | PokemonDetailed>(null);
  const { allImgsLoaded, handleImgLoad, resetImgsLoadCheck } = useWaitForImgsLoad();
  const speciesFetchHook = useFetch();
  const evolutionFetchHook = useFetch();
  const speciesData = speciesFetchHook.data as SerialisedSpecies;
  const speciesFetchConfig = speciesFetchHook.setFetchConfig;
  const evolutionPaths = evolutionFetchHook.data as EvoPath[][];
  const evolutionFetchConfig = evolutionFetchHook.setFetchConfig;
  const loading = speciesFetchHook.loading || evolutionFetchHook.loading;

  useEffect(() => {
    if (!selectedPokemon) return;
    speciesFetchConfig(
      `https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.id}`,
      serialisePokemonSpecies
    );
    setPokemonDetailed(null);
  }, [selectedPokemon, speciesFetchConfig]);

  useEffect(() => {
    if (speciesData) {
      evolutionFetchConfig(speciesData.evolutionChain, serialiseEvolutionTree);
    }
  }, [speciesData, evolutionFetchConfig]);

  useEffect(() => {
    if (evolutionPaths && selectedPokemon && speciesData) {
      const { description, species, genderRatio, eggGroups } = speciesData;
      const { id, name, ...pokemon } = selectedPokemon;
      const animatedImgSrc = getAnimatedImgSrc(id, name);
      const detailed: PokemonDetailed = {
        id,
        name,
        description,
        species,
        genderRatio,
        eggGroups,
        evolutionPaths,
        animatedImgSrc,
        ...pokemon,
      };
      resetImgsLoadCheck(1);
      setPokemonDetailed(detailed);
    }
  }, [evolutionPaths, selectedPokemon, speciesData, resetImgsLoadCheck]);

  let content: string | ReactNode = 'Select a Pokémon from the list';
  if (loading) content = 'loading...';
  else if (pokemonDetailed) {
    const infoTabs = [
      {
        label: 'About',
        content: (
          <PokemonAbout
            species={pokemonDetailed.species}
            abilities={pokemonDetailed.abilities}
            genderRatio={pokemonDetailed.genderRatio}
            eggGroups={pokemonDetailed.eggGroups}
          />
        ),
      },
      {
        label: 'Description',
        content: pokemonDetailed.description,
      },
      {
        label: 'Moves',
        content: (
          <PokemonMovesTable
            taughtMoves={pokemonDetailed.taughtMoves}
            levelUpMoves={pokemonDetailed.levelUpMoves}
          />
        ),
      },
      {
        label: 'Evolution Paths',
        content: <PokemonEvolutionPaths evolutionPaths={pokemonDetailed.evolutionPaths} />,
      },
    ];

    content = (
      <Fragment>
        {!allImgsLoaded && 'loading images'}
        <div style={{ display: allImgsLoaded ? 'block' : 'none' }}>
          {pokemonDetailed.name}
          <img
            src={pokemonDetailed.animatedImgSrc || pokemonDetailed.imgSrc}
            alt={pokemonDetailed.name}
            onLoad={handleImgLoad}
          />
          <PokemonStats stats={pokemonDetailed.stats} />
          {pokemonDetailed.height * 10}cm
          {pokemonDetailed.weight / 10}kg
          <InfoTabsContainer config={infoTabs} />
        </div>
      </Fragment>
    );
  }

  return <div>{content}</div>;
};

export default PokemonDetailedContainer;
