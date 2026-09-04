import { createContext, FC, ReactNode, useContext } from 'react';
import { useFormsData } from './useFormsData';

type UseFormsData = ReturnType<typeof useFormsData>;

// @ts-expect-error
const FormsContext = createContext<UseFormsData>({});

export const FormsProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const formsData = useFormsData();

  return (
    <FormsContext.Provider value={formsData}>
      {children}
    </FormsContext.Provider>
  );
};

export const useForms = () => useContext(FormsContext);
