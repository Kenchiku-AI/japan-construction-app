import { useState } from 'react';

export const useFadeState = () => {
  const [isFadeShown, setIsFadeShown] = useState(false);

  return {
    isFadeShown,
    setIsFadeShown,
  };
};
