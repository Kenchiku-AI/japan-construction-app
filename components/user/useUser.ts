'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../services/api/useApi';
import { useAuth } from '../../context/auth/AuthContext';
import { UpdateUserRequest } from '../../types';

export const useUser = () => {
  const api = useApi();
  const { currentUser, setCurrentUser } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateUser = useCallback(
    async (request: UpdateUserRequest) => {
      if (!currentUser) return;

      setLoading(true);

      try {
        const response = await api.updateUser(currentUser.id, request);

        if (response) {
          setCurrentUser({
            ...currentUser,
            ...response,
          });
        }
      } catch (err) {
        setError(t('update_user_error_description'));
      }

      setLoading(false);
    },
    [currentUser],
  );

  return {
    loading,
    updateUser,
    error,
    setError,
  };
};
