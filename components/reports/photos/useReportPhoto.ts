'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage, ReportImageTag } from '../../../types';
import { useApi } from '../../../services/api/useApi';
import { usePhotos } from '../../../context/photos/PhotosContext';

export const useReportPhoto = (initialImage: ReportImage) => {
  const [image, setImage] = useState(initialImage);
  const { deletePhoto, replacePhoto } = usePhotos();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setOnCurrentImageUpdated, onTagsAdded, onTagRemoved } = usePhotos();
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    setOnCurrentImageUpdated(
      () => (tags: ReportImageTag[], description?: string) => {
        let newImage = { ...image };
        newImage.status = 'completed';

        tags.forEach(tag => {
          const hasTag = newImage.tags.some(t => t.tag_id === tag.tag_id);

          if (!hasTag) {
            newImage.tags.push(tag);
          }
        });

        if (description) {
          onDescriptionUpdated(description);
        }

        setImage(newImage);
      },
    );
  }, [image]);

  const deleteImage = useCallback(async () => {
    setLoading(true);

    try {
      await api.deleteImage(image.report_id, image.id);
      deletePhoto(image);
    } catch (err) {
      setError(t('delete_photo_error'));
    }

    setLoading(false);
  }, [image, deletePhoto]);

  const updateImage = useCallback(
    async (description: string) => {
      setLoading(true);

      try {
        const response = await api.updateImage(image.report_id, image.id, {
          description,
        });

        if (response) {
          setImage(response);
          replacePhoto(response);
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

          onTagsAdded?.(image.id, [response]);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [image, onTagsAdded],
  );

  const removeTag = useCallback(
    async (linkId: string) => {
      setLoading(true);

      try {
        await api.removeTag(image.report_id, image.id, linkId);

        const tags = image.tags.filter(t => t.link_id !== linkId);
        setImage({ ...image, tags });

        onTagRemoved?.(image.id, linkId);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [image, onTagRemoved],
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
