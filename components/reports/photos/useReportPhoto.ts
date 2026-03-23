'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage } from '../../../types';
import { useApi } from '../../../services/api/useApi';

export const useReportPhoto = (initialImage: ReportImage) => {
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const api = useApi();

  const deleteImage = useCallback(async () => {
    setLoading(true);

    try {
      await api.deleteImage(image.report_id, image.id);
    } catch (err) {
      setError(t('delete_photo_error'));
    }

    setLoading(false);
  }, [image]);

  const updateImage = useCallback(
    async (description: string) => {
      setLoading(true);

      try {
        const respose = await api.updateImage(image.report_id, image.id, {
          description,
        });

        if (respose) setImage(respose);
      } catch (err) {
        setError(t('update_photo_error'));
      }

      setLoading(false);
    },
    [image],
  );

  return {
    image,
    deleteImage,
    updateImage,
    loading,
    error,
    setError,
  };
};
