'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Report, ReportRequest } from '../../types';
import { useApi } from '../../services/api/useApi';

export const useReport = (reportId: string) => {
  const [loading, setLoading] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [report, setReport] = useState<Report>();
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    getReport(reportId);
  }, [reportId]);

  const getReport = useCallback(
    async (reportId: string) => {
      setLoading(true);

      try {
        const response = await api.getReport(reportId);
        setReport(response);
      } catch (err) {}

      setLoading(false);
    },
    [setReport],
  );

  const updateReport = useCallback(
    async (request: ReportRequest, silent: boolean = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const response = await api.updateReport(reportId, request);
        setReport(response);

        if (!silent) {
          // TODO: show success
        }
      } catch (err) {
        if (!silent) {
          // TODO: show error
        }
      }

      setLoading(false);
    },
    [setReport, reportId],
  );

  return {
    loading,
    report,
    updateReport,
    isProcessingAudio,
  };
};
