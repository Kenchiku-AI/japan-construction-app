'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage } from '../../../types';
import { useApi } from '../../../services/api/useApi';

export const useReportPhotos = (reportId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<ReportImage[]>();
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReportImages(reportId);
      setPhotos(response);
    } catch (err) {
      console.log('error', err);
      setError(t('get_photos_error'));
    }

    setLoading(false);
  }, [reportId]);

  const deletePhoto = useCallback(
    async (imageId: string) => {
      setLoading(true);

      try {
        await api.deleteImage(reportId, imageId);
      } catch (err) {
        setError(t('delete_photo_error'));
      }

      await getPhotos();
    },
    [reportId],
  );

  return {
    deletePhoto,
    loading,
    photos,
    error,
    setError,
  };
};
