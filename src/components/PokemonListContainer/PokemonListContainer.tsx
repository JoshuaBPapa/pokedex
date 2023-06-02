import { Fragment, useEffect, useReducer, useRef, useState } from 'react';
import { useCachedData, useFetch } from '../../hooks';
import { serialisePokemonInfo, serialisePokemonNames } from '../../serialisers';
import SearchInput from '../SearchInput/SearchInput';
import Pagination from '../Pagination/Pagination';
import { Pokemon } from '../../interfaces';
import PokemonCard from '../PokemonCard/PokemonCard';

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

  if (range[1] > list.length - 1) {
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
  handleSelectedPokemon: (name: string) => void;
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
  const [allImgsLoaded, setAllImgsLoaded] = useState(false);
  const imgsLoadedCount = useRef(0);
  const listData = fetchHook.data as null | Pokemon[];
  const dataLoading = cachedDataHook.loading || fetchHook.loading;

  useEffect(() => {
    const allPokemonNames = cachedDataHook.cachedData as null | string[];
    if (!allPokemonNames) return;
    const names = getNameList(search, allPokemonNames);
    const { urls, isEnd } = nextPokemonUrls(names, page);
    setIsEndofResults(isEnd);
    setFetchConfig(urls, serialisePokemonInfo);
    setAllImgsLoaded(false);
    imgsLoadedCount.current = 0;
  }, [cachedDataHook.cachedData, search, page, setFetchConfig]);

  const handleSearchInput = (search: string): void => {
    dispatch({ type: ParamsActionType.NEW_SEARCH, search });
  };

  const handlePageClick = (direction: string): void => {
    if (isEndOfResults) return;
    if (direction === 'prev') dispatch({ type: ParamsActionType.PREV_PAGE });
    else dispatch({ type: ParamsActionType.NEXT_PAGE });
  };

  const handleImgLoad = (): void => {
    if (listData && imgsLoadedCount.current === listData.length - 1) {
      setAllImgsLoaded(true);
    } else {
      imgsLoadedCount.current = imgsLoadedCount.current + 1;
    }
  };

  let content: string | JSX.Element = '';
  if (dataLoading) content = 'loading';
  else if (listData) {
    content = (
      <Fragment>
        {!allImgsLoaded && 'loading images'}
        <ul style={{ display: allImgsLoaded ? 'block' : 'none' }}>
          {listData.map((pokemon) => {
            return (
              <li key={pokemon.id}>
                <button onClick={() => handleSelectedPokemon(pokemon.name)}>view</button>
                <PokemonCard pokemon={pokemon} handleImageLoad={handleImgLoad} />
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }
  return (
    <div>
      <SearchInput handleSearchInput={handleSearchInput} disabled={dataLoading || !allImgsLoaded} />
      <Pagination
        currentPage={page}
        handlePageClick={handlePageClick}
        onLastPage={isEndOfResults}
        allDisabled={dataLoading || !allImgsLoaded}
      />
      {content}
    </div>
  );
};

export default PokemonListContainer;
