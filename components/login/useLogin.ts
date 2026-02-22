import { useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { useAuth } from '../../context/auth/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { updateAccessToken, updateRefreshToken, setCurrentUser } = useAuth();
  const api = useApi();

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const { access_token, refresh_token } = await api.login({
        email,
        password,
      });

      updateAccessToken(access_token);
      updateRefreshToken(refresh_token);

      const user = await api.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {}

    setLoading(false);
  };

  return {
    loading,
    login,
  };
};
