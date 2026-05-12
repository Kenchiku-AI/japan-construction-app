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

  const addTags = (imageId: string, tags: ReportImageTag[]) => {
    const index = photosRef.current.findIndex(p => p.id === imageId);
    if (index === -1) return;

    let photo = { ...photosRef.current[index] };
    photo.status = 'completed';

    tags.forEach(tag => {
      const hasTag = photo.tags.some(t => t.tag_id === tag.tag_id);

      if (!hasTag) {
        photo.tags.push(tag);
      }
    });

    const newPhotos = [...photosRef.current];
    newPhotos[index] = photo;
    setPhotos(newPhotos);
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

  const addDescription = (imageId: string, description?: string) => {
    if (!description) return;

    const index = photosRef.current.findIndex(p => p.id === imageId);
    if (index === -1) return;

    let photo = { ...photosRef.current[index] };
    photo.description = `${
      photo.description ? `${photo.description} ` : ''
    }${description}`;

    const newPhotos = [...photosRef.current];
    newPhotos[index] = photo;
    setPhotos(newPhotos);
  };

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
    addPhoto,
    addTags,
    removeTag,
    addDescription,
    loading,
    error,
    setError,
  };
};
