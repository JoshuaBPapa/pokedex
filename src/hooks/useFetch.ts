import { useCallback, useEffect, useReducer } from 'react';
import { Serialiser } from '../interfaces';
import { ReqActionType, ReqState, useReqReducer } from './useReqReducer';
import { fetchHandler } from '../helpers';

enum ReqConfigActionType {
  SET_CONFIG = 'set_config',
}

interface ReqConfigAction {
  type: ReqConfigActionType.SET_CONFIG;
  url: string | string[];
  serialiser?: Serialiser;
}

interface ReqConfigState {
  url: string | string[];
  serialiser?: Serialiser;
}

const initReqConfigState: ReqConfigState = {
  url: '',
};

const reqConfigReducer = (state: ReqConfigState, action: ReqConfigAction) => {
  switch (action.type) {
    case ReqConfigActionType.SET_CONFIG:
      return {
        url: action.url,
        serialiser: action.serialiser,
      };
    default:
      return initReqConfigState;
  }
};

interface UseFetchValue extends ReqState {
  setFetchConfig: (url: string | string[], serialiser?: Serialiser) => void;
}

type UseFetch = () => UseFetchValue;

export const useFetch: UseFetch = () => {
  const [{ url, serialiser }, reqConfigDispatch] = useReducer(reqConfigReducer, initReqConfigState);
  const { loading, error, data, reqDispatch } = useReqReducer();

  useEffect(() => {
    if (!url.length) {
      reqDispatch({
        type: ReqActionType.REQUEST_SUCCESS,
        data: null,
      });
      return;
    }

    reqDispatch({ type: ReqActionType.REQUEST_START });

    let completedRequest: Promise<Response | Response[]>;
    if (Array.isArray(url)) {
      completedRequest = Promise.all(url.map((u) => fetchHandler(fetch(u), serialiser)));
    } else {
      completedRequest = fetchHandler(fetch(url), serialiser);
    }

    completedRequest
      .then((resData) => {
        reqDispatch({
          type: ReqActionType.REQUEST_SUCCESS,
          data: resData,
        });
      })
      .catch((error) => {
        reqDispatch({
          type: ReqActionType.REQUEST_ERROR,
          error,
        });
      });
  }, [url, serialiser, reqDispatch]);

  const setFetchConfig = useCallback((url: string | string[], serialiser?: Serialiser): void => {
    reqConfigDispatch({
      type: ReqConfigActionType.SET_CONFIG,
      url,
      serialiser,
    });
  }, []);

  return {
    loading,
    error,
    data,
    setFetchConfig,
  };
};
