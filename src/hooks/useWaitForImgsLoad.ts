import { useCallback, useRef, useState } from 'react';

type UseWaitForImgsLoad = () => {
  allImgsLoaded: boolean;
  handleImgLoad: () => void;
  totalToLoadCount: React.MutableRefObject<number>;
  resetImgsLoadCheck: (totalCount: number) => void;
};

export const useWaitForImgsLoad: UseWaitForImgsLoad = () => {
  const [allImgsLoaded, setAllImgsLoaded] = useState(false);
  const totalToLoadCount = useRef(0);
  const imgsLoadedCount = useRef(0);

  const handleImgLoad = (): void => {
    imgsLoadedCount.current = imgsLoadedCount.current + 1;
    if (imgsLoadedCount.current === totalToLoadCount.current) setAllImgsLoaded(true);
  };

  const resetImgsLoadCheck = useCallback((totalCount = 0): void => {
    setAllImgsLoaded(false);
    totalToLoadCount.current = totalCount;
    imgsLoadedCount.current = 0;
  }, []);

  return {
    allImgsLoaded,
    handleImgLoad,
    totalToLoadCount,
    resetImgsLoadCheck,
  };
};
