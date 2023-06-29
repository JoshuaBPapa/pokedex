import { Dispatch, useReducer } from 'react';
import { CustomError } from '../classes';

export enum ReqActionType {
  REQUEST_START = 'request_start',
  REQUEST_ERROR = 'request_error',
  REQUEST_SUCCESS = 'request_sucess',
}

type ReqAction =
  | { type: ReqActionType.REQUEST_START }
  | { type: ReqActionType.REQUEST_ERROR; error: CustomError }
  | { type: ReqActionType.REQUEST_SUCCESS; data: any };

export interface ReqState {
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

interface UseReqReducerValue extends ReqState {
  reqDispatch: Dispatch<ReqAction>;
}

type UseReqReducer = () => UseReqReducerValue;

export const useReqReducer: UseReqReducer = () => {
  const [{ loading, error, data }, reqDispatch] = useReducer(reqReducer, initReqState);

  return {
    loading,
    error,
    data,
    reqDispatch,
  };
};
