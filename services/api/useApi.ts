import { useCallback, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  SignupRequest,
  SignupResponse,
  UserResponse,
} from '../../types';
import { baseUrl } from '../../constants';
import { useAuthContext } from '../../context/auth/AuthContext';
import { UnauthorizedError, UnknownError } from './errors';

export const useApi = () => {
  const { refreshToken, updateAccessToken, updateRefreshToken, logout } =
    useAuthContext();

  const call = <T>(callback: () => Promise<AxiosResponse<T>>) => {
    try {
      return handleResponse(callback());
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        refresh(callback);
      } else {
        throw err;
      }
    }
  };

  const handleResponse = async <T>(
    query: Promise<AxiosResponse<T>>,
  ): Promise<T> => {
    const { data, status } = await query;

    handleError(status);

    return data;
  };

  const handleError = (status: number) => {
    if (status >= 200 || status < 300) return;

    switch (status) {
      case 400:
        throw new Error('Bad request');
      case 401:
        throw new UnauthorizedError();
      case 403:
        throw new Error('Forbidden');
      case 404:
        throw new Error('Not found');
      case 500:
        throw new Error('Server error');
      default:
        throw new UnknownError();
    }
  };

  const refresh = useCallback(
    async <T>(callback: () => Promise<T>) => {
      try {
        const url = `${baseUrl}/auth/refresh`;
        const request = { refresh_token: refreshToken };
        const { data, status } = await axios.post<RefreshResponse>(
          url,
          request,
        );

        handleError(status);

        await updateAccessToken(data.access_token);
        await callback();
      } catch (err) {
        await logout();
      }
    },
    [refreshToken, updateAccessToken, updateRefreshToken, logout],
  );

  return {
    async login(request: LoginRequest) {
      const url = `${baseUrl}/auth/login`;
      return handleResponse(axios.post<LoginResponse>(url, request));
    },
    async signup(request: SignupRequest) {
      const url = `${baseUrl}/auth/signup`;
      return handleResponse(axios.post<SignupResponse>(url, request));
    },
    async getMe() {
      const url = `${baseUrl}/users/me`;
      return call(() => axios.get<UserResponse>(url));
    },
  };
};

export type ApiService = ReturnType<typeof useApi>;
