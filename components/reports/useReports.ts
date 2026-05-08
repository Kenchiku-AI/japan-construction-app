'use client';

import { useCallback, useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { CreateReportRequest, Report } from '../../types';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>();
  const [error, setError] = useState('');
  const api = useApi();

  const getReports = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReports();
      setReports(response);
    } catch (err) {
      setError('get_reports_error');
    }

    setLoading(false);
  }, [setReports]);

  const createReport = useCallback(
    async (request: CreateReportRequest) => {
      setLoading(true);

      try {
        const response = await api.createReport(request);
        if (!response) throw new Error();

        return response;
      } catch (err) {
        setError('create_report_error');
      } finally {
        setLoading(false);
      }
    },
    [getReports],
  );

  return {
    loading,
    reports,
    getReports,
    createReport,
    error,
    setError,
  };
};
