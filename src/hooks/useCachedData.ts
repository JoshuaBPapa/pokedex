import { useEffect, useState } from 'react';
import { CustomError } from '../classes';
import { Serialiser } from '../interfaces';
import { useFetch } from './useFetch';

const getLocalStorageItem = (key: string): unknown | null => {
  const jsonData = localStorage.getItem(key);
  return jsonData && JSON.parse(jsonData);
};

const setLocalStorage = (key: string, data: unknown): void => {
  const jsonData = JSON.stringify(data);
  localStorage.setItem(key, jsonData);
};

type UseCachedData = (
  key: string,
  url: string,
  responseSerialiser?: Serialiser
) => {
  loading: boolean;
  error: null | CustomError;
  cachedData: null | unknown;
};

export const useCachedData: UseCachedData = (key, url, responseSerialiser) => {
  const { loading, error, data, setFetchConfig } = useFetch();
  const [cachedData, setCachedData] = useState<null | unknown>(null);

  useEffect(() => {
    const localStorage = getLocalStorageItem(key);
    if (localStorage) setCachedData(localStorage);
    else {
      setFetchConfig(url, responseSerialiser);
    }
  }, [key, url, responseSerialiser, setFetchConfig]);

  useEffect(() => {
    if (data) {
      setLocalStorage(key, data);
      setCachedData(data);
    }
  }, [key, data]);

  return {
    loading,
    error,
    cachedData,
  };
};
