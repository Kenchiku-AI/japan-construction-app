import { createContext, FC, ReactNode, useContext } from 'react';
import { useSpeechData } from './useSpeechData';

type SpeechState = ReturnType<typeof useSpeechData>;

// @ts-expect-error
const SpeechContext = createContext<SpeechState>({});

export const SpeechProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const speechData = useSpeechData();

  return (
    <SpeechContext.Provider value={speechData}>
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => useContext(SpeechContext);
