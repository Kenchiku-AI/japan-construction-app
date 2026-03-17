import { createContext, FC, ReactNode, useContext } from 'react';
import { useCameraData } from './useCameraData';

type UseCameraData = ReturnType<typeof useCameraData>;

// @ts-expect-error
const CameraContext = createContext<UseCameraData>({});

export const CameraProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const cameraData = useCameraData();

  return (
    <CameraContext.Provider value={cameraData}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => useContext(CameraContext);
