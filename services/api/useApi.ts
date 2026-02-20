import { useCallback, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  SignupRequest,
  SignupResponse,
  CurrentUser,
  ReportTemplate,
} from '../../types';
import { baseUrl } from '../../constants';
import { useAuthContext } from '../../context/auth/AuthContext';

export const useApi = () => {
  const { refreshToken, updateAccessToken, updateRefreshToken, logout } =
    useAuthContext();

  useEffect(() => {
    axios.defaults.baseURL = baseUrl;
  }, []);

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
    return data;
  };

  const refresh = useCallback(
    async <T>(callback: () => Promise<AxiosResponse<T>>) => {
      try {
        const url = '/auth/refresh';
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
      const url = '/auth/login';
      return handleResponse(() => axios.post<LoginResponse>(url, request));
    },
    async signup(request: SignupRequest) {
      const url = '/auth/signup';
      return handleResponse(() => axios.post<SignupResponse>(url, request));
    },
    async getCurrentUser() {
      const url = '/users/me';
      return call(() => axios.get<CurrentUser>(url));
    },
    async getReportTemplates() {
      const url = '/reports/templates';
      return call(() => axios.get<ReportTemplate[]>(url));
    },
  };
};

export type ApiService = ReturnType<typeof useApi>;
