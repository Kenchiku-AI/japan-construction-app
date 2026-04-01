'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImage, ReportImageTag } from '../../../types';
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

  const replacePhoto = (photo: ReportImage) => {
    const index = photosRef.current.findIndex(p => p.id === photo.id);
    if (index === -1) return;

    const newPhotos = [...photosRef.current];
    newPhotos[index] = photo;
    setPhotos(newPhotos);
  };

  const addTag = (imageId: string, tag: ReportImageTag) => {
    const index = photosRef.current.findIndex(p => p.id === imageId);
    if (index === -1) return;

    let photo = { ...photosRef.current[index] };

    const hasTag = photo.tags.some(t => t.tag_id === tag.tag_id);

    if (!hasTag) {
      photo.tags.push(tag);

      const newPhotos = [...photosRef.current];
      newPhotos[index] = photo;
      setPhotos(newPhotos);
    }
  };

  const removeTag = (imageId: string, linkId: string) => {
    const index = photosRef.current.findIndex(p => p.id === imageId);
    if (index === -1) return;

    let photo = photosRef.current[index];
    const tags = photo.tags.filter(t => t.link_id !== linkId);

    const newPhotos = [...photosRef.current];
    newPhotos[index] = { ...photo, tags };
    setPhotos(newPhotos);
  };

  return {
    getPhotos,
    addPhoto,
    removePhoto,
    replacePhoto,
    addTag,
    removeTag,
    loading,
    photos,
    error,
    setError,
  };
};
