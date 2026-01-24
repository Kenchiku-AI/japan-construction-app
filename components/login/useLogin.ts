import { useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { useAuthContext } from '../../context/auth/AuthContext';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { setToken } = useAuthContext();
  const api = useApi();

  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const request = { email, password };
      const response = await api.login(request);
      setToken(response.data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return {
    loading,
    login,
  };
};
