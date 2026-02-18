import { useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  SignupRequest,
  SignupResponse,
  CurrentUser,
} from '../../types';
import { baseUrl } from '../../constants';
import { useAuthContext } from '../../context/auth/AuthContext';

export const useApi = () => {
  const { refreshToken, updateAccessToken, updateRefreshToken, logout } =
    useAuthContext();

  const call = async <T>(callback: () => Promise<AxiosResponse<T>>) => {
    try {
      return await handleResponse(callback);
    } catch (err) {
      if ((err as AxiosError).status === 401) {
        return await refresh(callback);
      } else {
        throw err;
      }
    }
  };

  const handleResponse = async <T>(
    query: () => Promise<AxiosResponse<T>>,
  ): Promise<T> => {
    const { data } = await query();

    console.log('DATA', data);

    return data;
  };

  const refresh = useCallback(
    async <T>(callback: () => Promise<AxiosResponse<T>>) => {
      try {
        const url = `${baseUrl}/auth/refresh`;
        const request = { refresh_token: refreshToken };
        const { data } = await axios.post<RefreshResponse>(url, request);
        await updateAccessToken(data.access_token);

        return await handleResponse(callback);
      } catch (err) {
        await logout();
      }
    },
    [refreshToken, updateAccessToken, updateRefreshToken, logout],
  );

  return {
    async login(request: LoginRequest) {
      const url = `${baseUrl}/auth/login`;
      return handleResponse(() => axios.post<LoginResponse>(url, request));
    },
    async signup(request: SignupRequest) {
      const url = `${baseUrl}/auth/signup`;
      return handleResponse(() => axios.post<SignupResponse>(url, request));
    },
    async getCurrentUser() {
      const url = `${baseUrl}/users/me`;
      return call(() => axios.get<CurrentUser>(url));
    },
  };
};

export type ApiService = ReturnType<typeof useApi>;
