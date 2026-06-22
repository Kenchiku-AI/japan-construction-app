'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Report, ReportRequest } from '../../types';
import { useApi } from '../../services/api/useApi';
import { navigateBack } from '../../navigation/navigate';
import { usePhotos } from '../../context/photos/PhotosContext';
import { useBilling } from '../../services/billing/useBilling';

export const useReport = (reportId: string) => {
  const [loading, setLoading] = useState(false);
  const { updatePhotoCount } = usePhotos();
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report>();
  const { t } = useTranslation();
  const { getBillingErrorReason } = useBilling();
  const api = useApi();

  const getReport = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReport(reportId);

      if (response) {
        setReport(response);
        updatePhotoCount(response.photo_count, reportId);
      }
    } catch (err) {
      setError(t('get_report_error'));
    }

    setLoading(false);
  }, [reportId, setReport]);

  const updateReport = useCallback(
    async (request: ReportRequest) => {
      setLoading(true);

      try {
        const response = await api.updateReport(reportId, request);

        if (response) {
          setReport(response);
          updatePhotoCount(response.photo_count, reportId);
        }
      } catch (err) {
        const reason = getBillingErrorReason(err);
        if (reason) {
          setError(`${reason}_description`);
        } else {
          setError(t('update_report_error'));
        }
      }

      setLoading(false);
    },
    [setReport, reportId],
  );

  const deleteReport = useCallback(async () => {
    setLoading(true);

    try {
      await api.deleteReport(reportId);
      navigateBack();
    } catch (err) {
      setError(t('delete_report_error'));
    }

    setLoading(false);
  }, [setReport, reportId]);

  return {
    loading,
    report,
    getReport,
    updateReport,
    deleteReport,
    error,
    setError,
  };
};
