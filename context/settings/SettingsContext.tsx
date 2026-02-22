import { createContext, FC, ReactNode, useContext } from 'react';
import { useSettingsData } from './useSettingsData';

type UseSettingsData = ReturnType<typeof useSettingsData>;

// @ts-expect-error
const SettingsContext = createContext<UseSettingsData>({});

export const SettingsProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const settingsData = useSettingsData();

  return (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
