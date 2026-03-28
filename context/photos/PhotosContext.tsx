import { createContext, FC, ReactNode, useContext } from 'react';
import { usePhotosData } from './usePhotosData';

type UsePhotosData = ReturnType<typeof usePhotosData>;

// @ts-expect-error
const PhotosContext = createContext<UsePhotosData>({});

export const PhotosProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const photosData = usePhotosData();

  return (
    <PhotosContext.Provider value={photosData}>
      {children}
    </PhotosContext.Provider>
  );
};

export const usePhotos = () => useContext(PhotosContext);
