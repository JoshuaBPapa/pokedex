import { useCallback, useEffect, useReducer } from 'react';
import { CustomError } from '../classes';
import { Serialiser } from '../interfaces';

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

enum ReqActionType {
  REQUEST_START = 'request_start',
  REQUEST_ERROR = 'request_error',
  REQUEST_SUCCESS = 'request_sucess',
}

type ReqAction =
  | { type: ReqActionType.REQUEST_START }
  | { type: ReqActionType.REQUEST_ERROR; error: CustomError }
  | { type: ReqActionType.REQUEST_SUCCESS; data: any };

interface ReqState {
  loading: boolean;
  error: null | CustomError;
  data: null | any;
}

const initReqState: ReqState = {
  loading: false,
  error: null,
  data: null,
};

const reqReducer = (state: ReqState, action: ReqAction): ReqState => {
  switch (action.type) {
    case ReqActionType.REQUEST_START:
      return {
        loading: true,
        error: null,
        data: null,
      };
    case ReqActionType.REQUEST_ERROR:
      return {
        loading: false,
        error: action.error,
        data: null,
      };
    case ReqActionType.REQUEST_SUCCESS:
      return {
        loading: false,
        error: null,
        data: action.data,
      };
    default:
      return initReqState;
  }
};

interface UseFetchValue extends ReqState {
  setFetchConfig: (url: string | string[], serialiser?: Serialiser) => void;
}

type UseFetch = () => UseFetchValue;

export const useFetch: UseFetch = () => {
  const [{ url, serialiser }, reqConfigDispatch] = useReducer(reqConfigReducer, initReqConfigState);
  const [{ loading, error, data }, reqDispatch] = useReducer(reqReducer, initReqState);

  useEffect(() => {
    if (!url.length) return;

    reqDispatch({ type: ReqActionType.REQUEST_START });

    const fetchHandler = (response: Promise<Response>): Promise<Response> => {
      return response
        .then((res) => {
          if (res.status >= 400) {
            throw new CustomError(res.status, res.statusText);
          }
          return res.json();
        })
        .then((resJson) => {
          return serialiser ? serialiser(resJson) : resJson;
        });
    };

    let completedRequest: Promise<Response | Response[]>;
    if (Array.isArray(url)) {
      completedRequest = Promise.all(url.map((u) => fetchHandler(fetch(u))));
    } else {
      completedRequest = fetchHandler(fetch(url));
    }

    completedRequest
      .then((data) => {
        reqDispatch({
          type: ReqActionType.REQUEST_SUCCESS,
          data,
        });
      })
      .catch((error) => {
        reqDispatch({
          type: ReqActionType.REQUEST_ERROR,
          error,
        });
      });
  }, [url, serialiser]);

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
