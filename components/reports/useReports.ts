'use client';

import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { CreateReportRequest, Report } from '../../types';
import { useAuth } from '../../context/auth/AuthContext';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>();
  const { currentUser } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (!currentUser) return;

    getReports();
  }, [currentUser]);

  const getReports = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReports();
      setReports(response);
    } finally {
      setLoading(false);
    }
  }, [setReports]);

  const createReport = useCallback(
    async (request: CreateReportRequest) => {
      setLoading(true);

      try {
        const response = await api.createReport(request);

        if (!response) throw new Error();

        return response;
      } catch (err) {
        // TODO: show error
      } finally {
        setLoading(false);
      }
    },
    [getReports],
  );

  return {
    loading,
    reports,
    createReport,
  };
};
