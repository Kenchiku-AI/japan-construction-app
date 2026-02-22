import { useCallback, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { accessTokenStorageKey, refreshTokenStorageKey } from '../../constants';
import axios from 'axios';
import { CurrentUser } from '../../types';

export const useAuthData = () => {
  const [accessToken, setAccessToken] = useState<string>();
  const [refreshToken, setRefreshToken] = useState<string>();
  const [currentUser, setCurrentUser] = useState<CurrentUser>();

  const updateAccessToken = useCallback(
    async (token: string) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await Keychain.setGenericPassword(accessTokenStorageKey, token, {
        service: accessTokenStorageKey,
      });
      setAccessToken(token);
    },
    [Keychain, setAccessToken],
  );

  const updateRefreshToken = useCallback(
    async (token: string) => {
      await Keychain.setGenericPassword(refreshTokenStorageKey, token, {
        service: refreshTokenStorageKey,
      });
      setRefreshToken(token);
    },
    [Keychain, setRefreshToken],
  );

  const logout = useCallback(async () => {
    delete axios.defaults.headers.common['Authorization'];
    await Keychain.resetGenericPassword({ service: accessTokenStorageKey });
    await Keychain.resetGenericPassword({ service: refreshTokenStorageKey });
    setAccessToken(undefined);
    setRefreshToken(undefined);
    setCurrentUser(undefined);
  }, [Keychain, setAccessToken, setRefreshToken, setCurrentUser]);

  return {
    accessToken,
    refreshToken,
    updateAccessToken,
    updateRefreshToken,
    logout,
    currentUser,
    setCurrentUser,
  };
};
