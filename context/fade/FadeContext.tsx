import { createContext, FC, ReactNode, useContext } from 'react';
import { useFadeState } from './useFadeState';

type FadeState = ReturnType<typeof useFadeState>;

// @ts-expect-error
const FadeContext = createContext<FadeState>({});

export const FadeProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const fadeState = useFadeState();

  return (
    <FadeContext.Provider value={fadeState}>{children}</FadeContext.Provider>
  );
};

export const useFade = () => useContext(FadeContext);
