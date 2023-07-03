import { Fragment, ReactNode, useEffect, useState } from 'react';
import { EvoPath, Pokemon, PokemonDetailed, SerialisedSpecies } from '../../interfaces';
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
import Message from '../Message/Message';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

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
    if (!data || !selectedPokemon) return;
    const [speciesData, evolutionPaths]: [SerialisedSpecies, EvoPath[][]] = data;
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
    setPokemonDetailed(detailed);
    // ignore selectedPokemon in dependancy array. PokemonDetailed should only be built when data is ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const typeColours = selectedPokemon && getPokemonTypecolours(selectedPokemon.types[0]);
  const primaryColour = typeColours ? typeColours.primarycolour : '#8A809D';
  const secondaryColour = typeColours ? typeColours.primarycolour : '#59bae9';

  let content: ReactNode = (
    <Message message="Select a Pokémon from the list" messageType="instruction" />
  );
  if (loading) content = 'loading...';
  else if (error) content = <ErrorMessage error={error} />;
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
            bgColour={primaryColour}
          />
        ),
      },
      {
        label: 'Evolution Paths',
        content: (
          <PokemonEvolutionPaths
            evolutionPaths={pokemonDetailed.evolutionPaths}
            bgColour={primaryColour}
          />
        ),
      },
    ];

    content = (
      <Fragment>
        {!allImgsLoaded && 'loading image'}
        <div className={allImgsLoaded ? 'pokemon-details' : 'display-none'}>
          <span className="pokemon-name">{pokemonDetailed.name}</span>
          <div className="pokemon-overview">
            <img
              className="pokemon-image"
              src={pokemonDetailed.animatedImgSrc || pokemonDetailed.imgSrc}
              alt={pokemonDetailed.name}
              onLoad={handleImgLoad}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = pokemonImgErr;
              }}
            />
            <PokemonStats stats={pokemonDetailed.stats} barColour={secondaryColour} />
            <div className="pokemon-extra-info">
              <div className="pokemon-types">
                {pokemonDetailed.types.map((type) => (
                  <PokemonTypePill key={type} type={type} />
                ))}
              </div>
              <div className="pokemon-measurements">
                <span className="measurement-title">Height:</span> {pokemonDetailed.height * 10} cm
                <span className="measurement-title">Weight:</span> {pokemonDetailed.weight / 10} kg
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
