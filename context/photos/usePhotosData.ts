import { useCallback, useEffect, useRef, useState } from 'react';
import { ReportImage, ReportImageTag } from '../../types';
import { useApi } from '../../services/api/useApi';
import ImageResizer from 'react-native-image-resizer';

type OnTagsAdded = (imageId: string, tags: ReportImageTag[]) => void;
type OnCurrentImageUpdated = (
  tags: ReportImageTag[],
  description?: string,
) => void;
type OnTagRemoved = (imageId: string, linkId: string) => void;

export const usePhotosData = () => {
  const [photosByReport, setPhotosByReport] = useState<
    Record<string, ReportImage[]>
  >({});
  const [onTagsAdded, setOnTagsAdded] = useState<OnTagsAdded>();
  const onTagsAddedRef = useRef<OnTagsAdded | undefined>(undefined);
  const [onTagRemoved, setOnTagRemoved] = useState<OnTagRemoved>();
  const [onCurrentImageUpdated, setOnCurrentImageUpdated] =
    useState<OnCurrentImageUpdated>();
  const onCurrentImageUpdatedRef = useRef<OnCurrentImageUpdated | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<Record<string, number>>({});
  const api = useApi();

  useEffect(() => {
    onTagsAddedRef.current = onTagsAdded;
  }, [onTagsAdded]);

  useEffect(() => {
    onCurrentImageUpdatedRef.current = onCurrentImageUpdated;
  }, [onCurrentImageUpdated]);

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
          }

          if (data.status === 'completed') {
            onTagsAddedRef.current?.(imageId, data.tags);
            onDescriptionAddedRef.current?.(imageId, data.description);
            onCurrentImageUpdatedRef.current?.(data.tags, data.description);
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
      let success = true;

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

        pollImageStatus(reportId, createResponse.id);
      } catch (err) {
        success = false;
      }

      setLoading(false);
      return success;
    },
    [photosByReport],
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
    },
    [photosByReport],
  );

  return {
    onTagsAdded,
    setOnTagsAdded,
    onTagRemoved,
    setOnTagRemoved,
    setOnCurrentImageUpdated,
    pollImageStatus,
    // new ones
    photosByReport,
    addPhoto,
    setPhotosByReport,
    deletePhoto,
    replacePhoto,
    loading,
  };
};
