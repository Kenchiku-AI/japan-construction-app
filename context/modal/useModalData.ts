import { useState } from 'react';

export const useModalData = () => {
  const [isModalShown, setIsModalShown] = useState(false);

  return {
    isModalShown,
    setIsModalShown,
  };
};
