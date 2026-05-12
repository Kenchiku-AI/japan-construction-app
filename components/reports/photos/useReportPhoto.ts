'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage } from '../../../types';
import { useApi } from '../../../services/api/useApi';
import { usePhotos } from '../../../context/photos/PhotosContext';

export const useReportPhoto = (initialImage: ReportImage) => {
  const { photosByReport, deletePhoto, replacePhoto } = usePhotos();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const api = useApi();

  const image = useMemo(() => {
    return photosByReport[initialImage.report_id]?.find(
      i => i.id === initialImage.id,
    );
  }, [initialImage, photosByReport]);

  const deleteImage = useCallback(async () => {
    setLoading(true);

    try {
      await api.deleteImage(initialImage.report_id, initialImage.id);
      deletePhoto(initialImage);
    } catch (err) {
      setError(t('delete_photo_error'));
    }

    setLoading(false);
  }, [initialImage, deletePhoto]);

  const updateImage = useCallback(
    async (description: string) => {
      setLoading(true);

      try {
        const response = await api.updateImage(
          initialImage.report_id,
          initialImage.id,
          {
            description,
          },
        );

        if (response) {
          replacePhoto(response);
        }
      } catch (err) {
        setError(t('update_photo_error'));
      }

      setLoading(false);
    },
    [initialImage],
  );

  const addTag = useCallback(
    async (tagId: string) => {
      if (!image) return;
      setLoading(true);

      try {
        const request = { tag_id: tagId };
        const response = await api.addTag(image.report_id, image.id, request);

        if (response) {
          const hasTag = image.tags.some(t => t.tag_id === tagId);

          if (!hasTag) {
            const tags = [...image.tags];
            tags.push(response);
            replacePhoto({ ...image, tags });
          }
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [image],
  );

  const removeTag = useCallback(
    async (linkId: string) => {
      if (!image) return;
      setLoading(true);

      try {
        await api.removeTag(image.report_id, image.id, linkId);

        const tags = image.tags.filter(t => t.link_id !== linkId);
        replacePhoto({ ...image, tags });
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [image],
  );

  return {
    image,
    deleteImage,
    updateImage,
    addTag,
    removeTag,
    loading,
    error,
    setError,
  };
};
