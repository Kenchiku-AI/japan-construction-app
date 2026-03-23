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
  Report,
  CreateReportRequest,
  ReportRequest,
  ReportSpeechRequest,
  ReportSpeechResponse,
  CreateImageResponse,
  ReportImage,
  ReportImageCreateRequest,
  ReportImageUpdateRequest,
} from '../../types';
import { baseUrl } from '../../constants';
import { useAuth } from '../../context/auth/AuthContext';

export const useApi = () => {
  const { refreshToken, updateAccessToken, updateRefreshToken, logout } =
    useAuth();

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
    async getReports() {
      const url = `/reports`;
      return call(() => axios.get<Report[]>(url));
    },
    async getReport(reportId: string) {
      const url = `/reports/${reportId}`;
      return call(() => axios.get<Report>(url));
    },
    async createReport(request: CreateReportRequest) {
      const url = '/reports';
      return call(() => axios.post<Report>(url, request));
    },
    async updateReport(reportId: string, request: ReportRequest) {
      const url = `/reports/${reportId}`;
      return call(() => axios.patch<Report>(url, request));
    },
    async reportSpeech(reportId: string, request: ReportSpeechRequest) {
      const url = `/reports/${reportId}/speech`;
      return call(() => axios.post<ReportSpeechResponse>(url, request));
    },
    async getReportTemplates() {
      const url = '/reports/templates';
      return call(() => axios.get<ReportTemplate[]>(url));
    },
    async deleteReport(reportId: string) {
      const url = `/reports/${reportId}`;
      return call(() => axios.delete(url));
    },
    async createReportImage(
      reportId: string,
      request: ReportImageCreateRequest,
    ) {
      const url = `/reports/${reportId}/images`;
      return call(() => axios.post<CreateImageResponse>(url, request));
    },
    async getReportImages(reportId: string) {
      const url = `/reports/${reportId}/images`;
      return call(() => axios.get<ReportImage[]>(url));
    },
    async deleteImage(reportId: string, imageId: string) {
      const url = `/reports/${reportId}/images/${imageId}`;
      return call(() => axios.delete(url));
    },
    async updateImage(
      reportId: string,
      imageId: string,
      request: ReportImageUpdateRequest,
    ) {
      const url = `/reports/${reportId}/images/${imageId}`;
      return call(() => axios.patch<ReportImage>(url, request));
    },
  };
};

export type ApiService = ReturnType<typeof useApi>;
