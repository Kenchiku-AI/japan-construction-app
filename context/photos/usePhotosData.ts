import { useEffect, useRef, useState } from 'react';
import { ReportImage, ReportImageTag } from '../../types';
import { useAuth } from '../auth/AuthContext';
import { wsUrl } from '../../constants';

type OnPhotoAdded = (uri: string) => void;
type OnPhotoDeleted = (imageId: string) => void;
type OnPhotoUpdated = (photo: ReportImage) => void;
type OnTagsAdded = (imageId: string, tags: ReportImageTag[]) => void;
type OnCurrenImageTagsAdded = (tags: ReportImageTag[]) => void;
type OnTagRemoved = (imageId: string, linkId: string) => void;

export const usePhotosData = () => {
  const [onPhotoAdded, setOnPhotoAdded] = useState<OnPhotoAdded>();
  const [onPhotoDeleted, setOnPhotoDeleted] = useState<OnPhotoDeleted>();
  const [onPhotoUpdated, setOnPhotoUpdated] = useState<OnPhotoUpdated>();
  const [onTagsAdded, setOnTagsAdded] = useState<OnTagsAdded>();
  const [onCurrentImageTagsAdded, setOnCurrentImageTagsAdded] =
    useState<OnTagsAdded>();
  const [onTagRemoved, setOnTagRemoved] = useState<OnTagRemoved>();

  const wsRef = useRef<WebSocket | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) {
      wsRef.current?.close();
      return;
    }

    const encodedToken = encodeURIComponent(accessToken);
    const ws = new WebSocket(
      `${wsUrl}/reports/images/ws?access_token=${encodedToken}`,
    );

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = event => {
      console.log('WS EVENT', event);

      try {
        const data = JSON.parse(event.data);

        if (data.type === 'image_tags_ready') {
          const;
        }
      } catch (err) {
        console.warn('Invalid WS message', err);
      }
    };

    ws.onerror = err => {
      console.error('WebSocket error', err);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [accessToken, onTagsAdded, onCurrentImageTagsAdded]);

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
    setOnCurrentImageTagsAdded,
  };
};
