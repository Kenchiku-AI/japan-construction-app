import { createContext, FC, ReactNode, useContext } from 'react';
import { useAuthData } from './useAuthData';

type UseAuthData = ReturnType<typeof useAuthData>;

// @ts-expect-error
const AuthContext = createContext<UseAuthData>({});

export const AuthProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const authData = useAuthData();

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
