import { useState } from 'react';

type OnConfirmImage = (uri: string) => void;

export const useCameraData = () => {
  const [onConfirmImage, setOnConfirmImage] = useState<OnConfirmImage>();

  return {
    onConfirmImage,
    setOnConfirmImage,
  };
};
