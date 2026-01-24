import { createContext, FC, ReactNode, useContext } from 'react';
import { useAuth } from './useAuth';

type UseAuthData = ReturnType<typeof useAuth>;

// @ts-expect-error
const AuthContext = createContext<UseAuthData>({});

export const AuthProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const authData = useAuth();

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
