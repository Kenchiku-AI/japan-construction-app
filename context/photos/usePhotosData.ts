import { useCallback, useEffect, useRef, useState } from 'react';
import { ReportImage, ReportImageTag } from '../../types';
import { useApi } from '../../services/api/useApi';

type OnPhotoAdded = (uri: string) => void;
type OnPhotoDeleted = (imageId: string) => void;
type OnPhotoUpdated = (photo: ReportImage) => void;
type OnTagsAdded = (imageId: string, tags: ReportImageTag[]) => void;
type OnDescriptionAdded = (imageId: string, description?: string) => void;
type OnCurrentImageUpdated = (
  tags: ReportImageTag[],
  description?: string,
) => void;
type OnTagRemoved = (imageId: string, linkId: string) => void;

export const usePhotosData = () => {
  const [onPhotoAdded, setOnPhotoAdded] = useState<OnPhotoAdded>();
  const [onPhotoDeleted, setOnPhotoDeleted] = useState<OnPhotoDeleted>();
  const [onPhotoUpdated, setOnPhotoUpdated] = useState<OnPhotoUpdated>();
  const [onTagsAdded, setOnTagsAdded] = useState<OnTagsAdded>();
  const onTagsAddedRef = useRef<OnTagsAdded | undefined>(undefined);
  const [onTagRemoved, setOnTagRemoved] = useState<OnTagRemoved>();
  const [onDescriptionAdded, setOnDescriptionAdded] =
    useState<OnDescriptionAdded>();
  const onDescriptionAddedRef = useRef<OnDescriptionAdded | undefined>(
    undefined,
  );
  const [onCurrentImageUpdated, setOnCurrentImageUpdated] =
    useState<OnCurrentImageUpdated>();
  const onCurrentImageUpdatedRef = useRef<OnCurrentImageUpdated | undefined>(
    undefined,
  );
  const pollingRef = useRef<Record<string, number>>({});
  const api = useApi();

  useEffect(() => {
    onTagsAddedRef.current = onTagsAdded;
  }, [onTagsAdded]);

  useEffect(() => {
    onDescriptionAddedRef.current = onDescriptionAdded;
  }, [onDescriptionAdded]);

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

  return {
    onPhotoAdded,
    setOnPhotoAdded,
    onPhotoDeleted,
    setOnPhotoDeleted,
    onPhotoUpdated,
    setOnPhotoUpdated,
    onTagsAdded,
    setOnTagsAdded,
    onTagRemoved,
    setOnTagRemoved,
    setOnDescriptionAdded,
    setOnCurrentImageUpdated,
    pollImageStatus,
  };
};
