'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage } from '../../../types';
import { useApi } from '../../../services/api/useApi';

export const useReportPhotos = (reportId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<ReportImage[]>([]);
  const photosRef = useRef<ReportImage[]>([]);
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  const getPhotos = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReportImages(reportId);

      const sortedPhotos = [...(response ?? [])].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setPhotos(sortedPhotos);
    } catch (err) {
      setError(t('get_photos_error'));
    }

    setLoading(false);
  }, [reportId]);

  const addPhoto = (photo: ReportImage) => {
    setPhotos([photo, ...photosRef.current]);
  };

  const removePhoto = (id: string) => {
    setPhotos(photosRef.current.filter(p => p.id !== id));
  };

  return {
    getPhotos,
    addPhoto,
    removePhoto,
    loading,
    photos,
    error,
    setError,
  };
};
