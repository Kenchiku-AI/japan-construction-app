import { useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { useAuthContext } from '../../context/auth/AuthContext';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { setTokens } = useAuthContext();
  const api = useApi();

  const signup = async (email: string, password: string) => {
    setLoading(true);

    try {
      const request = { email, password };
      const response = await api.signup(request);
      response.console.log();

      // setToken(response);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return {
    loading,
    signup,
  };
};
