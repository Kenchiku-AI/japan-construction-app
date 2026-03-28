import { useState } from 'react';
import { ReportImage, ReportImageTag } from '../../types';

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
