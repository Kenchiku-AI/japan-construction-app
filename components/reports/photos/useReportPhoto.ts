'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage } from '../../../types';
import { useApi } from '../../../services/api/useApi';
import { usePhotos } from '../../../context/photos/PhotosContext';

export const useReportPhoto = (initialImage: ReportImage) => {
  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { onPhotoUpdated, onTagAdded, onTagRemoved } = usePhotos();
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
        const response = await api.updateImage(image.report_id, image.id, {
          description,
        });

        if (response) {
          setImage(response);
          onPhotoUpdated?.(response);
        }
      } catch (err) {
        setError(t('update_photo_error'));
      }

      setLoading(false);
    },
    [image],
  );

  const addTag = useCallback(
    async (tagId: string) => {
      setLoading(true);

      try {
        const request = { tag_id: tagId };
        const response = await api.addTag(image.report_id, image.id, request);

        if (response) {
          const hasTag = image.tags.some(t => t.tag_id === tagId);

          if (!hasTag) {
            const tags = [...image.tags];
            tags.push(response);
            setImage({ ...image, tags });
          }

          onTagAdded?.(image.id, response);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [image, onTagAdded],
  );

  const removeTag = useCallback(
    async (linkId: string) => {
      setLoading(true);

      try {
        await api.removeTag(image.report_id, image.id, linkId);

        onTagRemoved?.(image.id, linkId);

        const tags = image.tags.filter(t => t.link_id !== linkId);
        setImage({ ...image, tags });
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [image, onTagAdded],
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
