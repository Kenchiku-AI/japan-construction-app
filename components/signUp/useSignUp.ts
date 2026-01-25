import { useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { useAuthContext } from '../../context/auth/AuthContext';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const { updateAccessToken, updateRefreshToken } = useAuthContext();
  const api = useApi();

  const signup = async (email: string, password: string) => {
    setLoading(true);

    try {
      const request = { email, password };
      const response = await api.signup(request);
      console.log(response);

      updateAccessToken(response.access_token);

      // setToken(response);
    } catch (err) {
      console.log('sign up error', err);
    }
    setLoading(false);
  };

  return {
    loading,
    signup,
  };
};
