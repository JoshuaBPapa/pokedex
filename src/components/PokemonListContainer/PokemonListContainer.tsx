import { Fragment, ReactNode, useEffect, useReducer, useState } from 'react';
import { useCachedData, useFetch, useWaitForImgsLoad } from '../../hooks';
import { serialisePokemonInfo, serialisePokemonNames } from '../../serialisers';
import SearchInput from '../SearchInput/SearchInput';
import Pagination from '../Pagination/Pagination';
import { Pokemon } from '../../interfaces';
import PokemonCard from '../PokemonCard/PokemonCard';
import PokedexScreen from '../PokedexScreen/PokedexScreen';
import './PokemonListContainer.scss';
import Message from '../Message/Message';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loading from '../Loading/Loading';

enum ParamsActionType {
  NEXT_PAGE = 'next_page',
  PREV_PAGE = 'prev_page',
  NEW_SEARCH = 'new_search',
}

type ParamsAction =
  | { type: ParamsActionType.NEXT_PAGE }
  | { type: ParamsActionType.PREV_PAGE }
  | { type: ParamsActionType.NEW_SEARCH; search: string };

interface ParamsState {
  page: number;
  search: string;
}

const initParamsState: ParamsState = {
  page: 1,
  search: '',
};

const paramsReducer = (state: ParamsState, action: ParamsAction): ParamsState => {
  switch (action.type) {
    case ParamsActionType.NEXT_PAGE: {
      const page = state.page + 1;
      return { ...state, page };
    }
    case ParamsActionType.PREV_PAGE: {
      const page = state.page - 1;
      return { ...state, page };
    }
    case ParamsActionType.NEW_SEARCH: {
      const { search } = action;
      const page = 1;
      return { page, search };
    }
    default:
      return initParamsState;
  }
};

const getNameList = (search: string, nameList: string[]): string[] => {
  if (search) return nameList.filter((name: string) => name.startsWith(search));
  return nameList;
};

const calcNextPageRange = (list: string[], page: number): { range: number[]; isEnd: boolean } => {
  const rangeHigh = page * 20;
  const rangeLow = rangeHigh - 20;
  const range = [rangeLow, rangeHigh - 1];
  let isEnd = false;

  if (range[1] >= list.length - 1) {
    isEnd = true;
    range[1] = list.length - 1;
  }

  return {
    range,
    isEnd,
  };
};

const nextPokemonUrls = (nameList: string[], page: number): { urls: string[]; isEnd: boolean } => {
  const urls: string[] = [];
  const { range, isEnd } = calcNextPageRange(nameList, page);
  for (let i = range[0]; i <= range[1]; i++) {
    urls.push(`https://pokeapi.co/api/v2/pokemon/${nameList[i]}`);
  }

  return { urls, isEnd };
};

interface Props {
  handleSelectedPokemon: (pokemon: Pokemon) => void;
}

const PokemonListContainer: React.FC<Props> = ({ handleSelectedPokemon }) => {
  const [{ page, search }, dispatch] = useReducer(paramsReducer, initParamsState);
  const { setFetchConfig, ...fetchHook } = useFetch();
  const cachedDataHook = useCachedData(
    'pokemonNames',
    'https://pokeapi.co/api/v2/pokemon/?limit=1015',
    serialisePokemonNames
  );
  const [isEndOfResults, setIsEndofResults] = useState(false);
  const { allImgsLoaded, handleImgLoad, resetImgsLoadCheck } = useWaitForImgsLoad();
  const listData = fetchHook.data as null | Pokemon[];
  const dataLoading = cachedDataHook.loading || fetchHook.loading;
  const error = cachedDataHook.error || fetchHook.error;

  // check if full pokemon name list is cached in local storage using the useCachedDataHook
  // if not, wait until the name list to be fetched by useCachedDataHook
  // when name list is cached, begin fetching pokemon information for the list page
  // repeat process on page change or search input
  useEffect(() => {
    const allPokemonNames = cachedDataHook.cachedData as null | string[];
    if (!allPokemonNames) return;
    const names = getNameList(search, allPokemonNames);
    const { urls, isEnd } = nextPokemonUrls(names, page);
    setIsEndofResults(isEnd);
    setFetchConfig(urls, serialisePokemonInfo);
    resetImgsLoadCheck(urls.length);
  }, [cachedDataHook.cachedData, search, page, setFetchConfig, resetImgsLoadCheck]);

  const handleSearchInput = (search: string): void => {
    dispatch({ type: ParamsActionType.NEW_SEARCH, search });
  };

  const handlePageClick = (direction: string): void => {
    if (isEndOfResults && direction === 'next') return;
    if (direction === 'prev') dispatch({ type: ParamsActionType.PREV_PAGE });
    else dispatch({ type: ParamsActionType.NEXT_PAGE });
  };

  let content: ReactNode = <Loading message="Loading Pokémon List" />;
  if (dataLoading) content = <Loading message="Loading Pokémon List" />;
  else if (error) content = <ErrorMessage error={error} />;
  else if (!listData && search) {
    content = <Message message="Pokémon not found" messageType="information" />;
  } else if (listData) {
    content = (
      <Fragment>
        {!allImgsLoaded && <Loading message="Loading Images" />}
        <ul className={allImgsLoaded ? 'pokemon-list-loaded' : 'display-none'}>
          {listData.map((pokemon) => {
            return (
              <li key={pokemon.id} className="pokemon-list-item">
                <button
                  title="select pokemon"
                  aria-label="select pokemon"
                  onClick={() => handleSelectedPokemon(pokemon)}
                  className="select-button"
                ></button>
                <PokemonCard pokemon={pokemon} handleImageLoad={handleImgLoad} />
              </li>
            );
          })}
        </ul>
        {isEndOfResults && allImgsLoaded && (
          <div className="end-of-results">- END OF RESULTS -</div>
        )}
      </Fragment>
    );
  }

  return (
    <div className="pokemon-list-container">
      <div className="list-params">
        <SearchInput
          handleSearchInput={handleSearchInput}
          disabled={dataLoading || !allImgsLoaded}
        />
        <Pagination
          currentPage={page}
          handlePageClick={handlePageClick}
          onLastPage={isEndOfResults}
          allDisabled={dataLoading || !allImgsLoaded}
        />
      </div>
      <PokedexScreen styleProps={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        {content}
      </PokedexScreen>
    </div>
  );
};

export default PokemonListContainer;
