'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageResizer from 'react-native-image-resizer';
import { Report, ReportRequest } from '../../types';
import { useApi } from '../../services/api/useApi';
import { navigateBack } from '../../navigation/navigate';
import { useCamera } from '../../context/camera/CameraContext';

export const useReport = (reportId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report>();
  const { setOnConfirmImage } = useCamera();
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
      } catch (err) {
        setError(t('get_report_error'));
      }

      setLoading(false);
    },
    [setReport],
  );

  const updateReport = useCallback(
    async (request: ReportRequest) => {
      setLoading(true);

      try {
        const response = await api.updateReport(reportId, request);
        setReport(response);
      } catch (err) {
        setError(t('update_report_error'));
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

  const uploadImage = useCallback(
    async (uri: string) => {
      setLoading(true);

      try {
        const resized = await ImageResizer.createResizedImage(
          uri,
          1024,
          1024,
          'JPEG',
          80,
        );

        const urls = await api.uploadImage(reportId);
        if (!urls) throw new Error();

        const response = await fetch(urls.upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: resized,
        });

        if (!response.ok) throw new Error();
      } catch (err) {
        setError(t('upload_image_error'));
      }

      setLoading(false);
    },
    [reportId],
  );

  useEffect(() => {
    setOnConfirmImage(() => (uri: string) => {
      uploadImage(uri);
    });

    return () => {
      setOnConfirmImage(undefined);
    };
  }, [uploadImage]);

  return {
    loading,
    report,
    updateReport,
    deleteReport,
    uploadImage,
    error,
    setError,
  };
};
