'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage, ReportImageTag } from '../../../types';
import { useApi } from '../../../services/api/useApi';
import { usePhotos } from '../../../context/photos/PhotosContext';

export const useReportPhotos = (reportId: string) => {
  const { photosByReport, setPhotosByReport } = usePhotos();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const photosRef = useRef<ReportImage[]>([]);
  const { t } = useTranslation();
  const api = useApi();
  const { pollImageStatus } = usePhotos();

  useEffect(() => {
    photosRef.current = photosByReport[reportId];
  }, [photosByReport[reportId]]);

  const getPhotos = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReportImages(reportId);
      if (!response) return;

      const sortedPhotos = [...(response ?? [])].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setPhotosByReport({
        ...photosByReport,
        [reportId]: sortedPhotos,
      });

      (response ?? []).forEach((img: ReportImage) => {
        if (img.status === 'pending' || img.status === 'processing') {
          pollImageStatus(reportId, img.id);
        }
      });
    } catch (err) {
      setError(t('get_photos_error'));
    }

    setLoading(false);
  }, [reportId, pollImageStatus, photosByReport]);

  return {
    getPhotos,
    loading,
    error,
    setError,
  };
};
