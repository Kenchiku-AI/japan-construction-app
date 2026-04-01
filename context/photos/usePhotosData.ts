import { useEffect, useRef, useState } from 'react';
import { ReportImage, ReportImageTag } from '../../types';
import { useAuth } from '../auth/AuthContext';
import { wsUrl } from '../../constants';

type OnPhotoAdded = (uri: string) => void;
type OnPhotoDeleted = (imageId: string) => void;
type OnPhotoUpdated = (photo: ReportImage) => void;
type OnTagAdded = (imageId: string, tag: ReportImageTag) => void;
type OnTagRemoved = (imageId: string, linkId: string) => void;

export const usePhotosData = () => {
  const [onPhotoAdded, setOnPhotoAdded] = useState<OnPhotoAdded>();
  const [onPhotoDeleted, setOnPhotoDeleted] = useState<OnPhotoDeleted>();
  const [onPhotoUpdated, setOnPhotoUpdated] = useState<OnPhotoUpdated>();
  const [onTagAdded, setOnTagAdded] = useState<OnTagAdded>();
  const [onTagRemoved, setOnTagRemoved] = useState<OnTagRemoved>();

  const wsRef = useRef<WebSocket | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.id) {
      wsRef.current?.close();
      return;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = event => {
      console.log('WS EVENT', event);

      try {
        const data = JSON.parse(event.data);

        if (data.type === 'image_tags_ready') {
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
  }, [currentUser?.id]);

  console.log('USER ID', currentUser?.id);

  return {
    onPhotoAdded,
    setOnPhotoAdded,
    onPhotoDeleted,
    setOnPhotoDeleted,
    onPhotoUpdated,
    setOnPhotoUpdated,
    onTagAdded,
    setOnTagAdded,
    onTagRemoved,
    setOnTagRemoved,
  };
};
