import { useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { useAuth } from '../../context/auth/AuthContext';
import { useTranslation } from 'react-i18next';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { updateAccessToken, updateRefreshToken, setCurrentUser, logout } =
    useAuth();
  const api = useApi();
  const { t } = useTranslation();

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

      if (user?.role === 'admin') {
        setError(t('admin_error'));
        logout();
        setLoading(false);
        return;
      }

      setCurrentUser(user);
    } catch (err) {
      setError(t('login_error'));
    }

    setLoading(false);
  };

  return {
    loading,
    login,
    error,
    setError,
  };
};
