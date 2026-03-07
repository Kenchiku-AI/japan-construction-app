import { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export const useModalData = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const fadeOpacity = useSharedValue(0);

  return {
    isModalShown,
    setIsModalShown,
    fadeOpacity,
  };
};
