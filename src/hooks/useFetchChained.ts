import { useEffect, useState } from 'react';
import { ReqActionType, ReqState, useReqReducer } from './useReqReducer';
import { Serialiser } from '../interfaces';
import { fetchHandler } from '../helpers';

interface ChainRequest {
  buildUrl: (params?: { [key: string]: any }) => string;
  buildNextParams?: (data: any) => { [key: string]: any };
  serialiser?: Serialiser;
}

interface UseFetchChainedValue extends ReqState {
  setFetchChain: (newFetchChain: ChainRequest[]) => void;
}

type RunFetch = (
  chainRequest: ChainRequest,
  params?: { [key: string]: any } | undefined
) => Promise<any[] | RunFetch | void>;

type UseFetchChained = () => UseFetchChainedValue;

export const useFetchChained: UseFetchChained = () => {
  const [fetchChain, setFetchChain] = useState<ChainRequest[]>([]);
  const { loading, error, data, reqDispatch } = useReqReducer();

  useEffect(() => {
    if (!fetchChain.length) return;
    const dataArray: any[] = [];
    let i = 0;

    reqDispatch({ type: ReqActionType.REQUEST_START });

    const runFetch: RunFetch = async (chainRequest, params?) => {
      const url = chainRequest.buildUrl(params);

      return fetchHandler(fetch(url), chainRequest.serialiser).then((resData) => {
        dataArray.push(resData);

        if (i >= fetchChain.length - 1) {
          return dataArray;
        }

        i++;
        const nextParams = chainRequest.buildNextParams && chainRequest.buildNextParams(resData);
        return runFetch(fetchChain[i], nextParams);
      });
    };

    runFetch(fetchChain[i])
      .then((res) => reqDispatch({ type: ReqActionType.REQUEST_SUCCESS, data: res }))
      .catch((error) => {
        reqDispatch({
          type: ReqActionType.REQUEST_ERROR,
          error,
        });
      });
  }, [fetchChain, reqDispatch]);

  return {
    setFetchChain,
    loading,
    error,
    data,
  };
};
