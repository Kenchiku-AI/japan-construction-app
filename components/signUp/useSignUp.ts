import { useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { useAuth } from '../../context/auth/AuthContext';

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { updateAccessToken, updateRefreshToken, setCurrentUser } = useAuth();
  const api = useApi();

  const signup = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);

    try {
      const request = { first_name, last_name, email, password };
      const response = await api.signup(request);

      updateAccessToken(response.access_token);
      updateRefreshToken(response.refresh_token);

      const user = await api.getCurrentUser();
      setCurrentUser(user);
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
