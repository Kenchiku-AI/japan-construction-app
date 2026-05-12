import { useCallback, useEffect, useRef, useState } from 'react';
import { ReportImage } from '../../types';
import { useApi } from '../../services/api/useApi';
import ImageResizer from 'react-native-image-resizer';
import { useTranslation } from 'react-i18next';

export const usePhotosData = () => {
  const [photosByReport, setPhotosByReport] = useState<
    Record<string, ReportImage[]>
  >({});
  const photosByReportRef = useRef<Record<string, ReportImage[]>>({});
  const [photoCountsByReport, setPhotoCountsByReport] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollingRef = useRef<Record<string, number>>({});
  const api = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    photosByReportRef.current = photosByReport;
  }, [photosByReport]);

  const pollImageStatus = useCallback(
    (reportId: string, imageId: string) => {
      let attempts = 0;
      const maxAttempts = 30;

      const poll = async () => {
        attempts++;

        try {
          const data = await api.getImageStatus(reportId, imageId);
          if (!data) return;

          if (
            data.status === 'completed' ||
            data.status === 'failed' ||
            attempts >= maxAttempts
          ) {
            clearInterval(pollingRef.current[imageId]);
            delete pollingRef.current[imageId];

            const photos = photosByReportRef.current?.[reportId];
            const index = photos.findIndex(i => i.id === imageId);

            if (index !== -1) {
              const newPhotos = [...photos];
              const photo = photos[index];

              if (data.status === 'completed') {
                newPhotos[index] = {
                  ...photo,
                  status: 'completed',
                  tags: [
                    ...data.tags.filter(
                      t => !photo.tags.some(pt => pt.tag_id === t.tag_id),
                    ),
                    ...photo.tags,
                  ],
                  description: data.description,
                };
              } else {
                newPhotos[index] = {
                  ...photo,
                  status: 'failed',
                };
              }

              setPhotosByReport({
                ...photosByReportRef.current,
                [reportId]: newPhotos,
              });
            }
          }
        } catch (err) {
          // console.error("Polling error:", err);
        }
      };

      if (!pollingRef.current[imageId]) {
        const interval = setInterval(poll, 1000);
        pollingRef.current[imageId] = interval;
      }

      poll();
    },
    [api],
  );

  const addPhoto = useCallback(
    async (uri: string, reportId: string) => {
      setLoading(true);

      try {
        const resized = await ImageResizer.createResizedImage(
          uri,
          1024,
          1024,
          'JPEG',
          80,
        );

        const request = {
          width: resized.width,
          height: resized.height,
        };

        const createResponse = await api.createReportImage(reportId, request);
        if (!createResponse) throw new Error();

        const uploadResponse = await fetch(createResponse.upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: resized,
        });

        if (!uploadResponse.ok) throw new Error();

        setPhotosByReport({
          ...photosByReport,
          [reportId]: [createResponse, ...(photosByReport[reportId] ?? [])],
        });

        const currentCount = photoCountsByReport[reportId] ?? 0;
        setPhotoCountsByReport({
          ...photoCountsByReport,
          [reportId]: currentCount + 1,
        });

        pollImageStatus(reportId, createResponse.id);
      } catch (err) {
        setError(t('upload_image_error'));
      }

      setLoading(false);
    },
    [photosByReport, photoCountsByReport],
  );

  const replacePhoto = useCallback(
    (image: ReportImage) => {
      const index = photosByReport[image.report_id].findIndex(
        i => i.id === image.id,
      );
      if (index === -1) return;

      const newImages = [...photosByReport[image.report_id]];
      newImages[index] = image;

      setPhotosByReport({
        ...photosByReport,
        [image.report_id]: newImages,
      });
    },
    [photosByReport],
  );

  const deletePhoto = useCallback(
    (image: ReportImage) => {
      const newImages = photosByReport[image.report_id].filter(
        i => i.id !== image.id,
      );

      setPhotosByReport({
        ...photosByReport,
        [image.report_id]: newImages,
      });

      const currentCount = photoCountsByReport[image.report_id] ?? 0;
      setPhotoCountsByReport({
        ...photoCountsByReport,
        [image.report_id]: Math.max(0, currentCount - 1),
      });
    },
    [photosByReport],
  );

  const updatePhotoCount = useCallback(
    (count: number, reportId: string) => {
      setPhotoCountsByReport({
        ...photoCountsByReport,
        [reportId]: count,
      });
    },
    [photoCountsByReport],
  );

  return {
    pollImageStatus,
    photosByReport,
    photoCountsByReport,
    addPhoto,
    setPhotosByReport,
    deletePhoto,
    replacePhoto,
    updatePhotoCount,
    loading,
    error,
    setError,
  };
};
