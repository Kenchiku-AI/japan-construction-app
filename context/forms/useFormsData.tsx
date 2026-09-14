import { useState } from 'react';
import { FormJob } from '../../types';

export const useFormsData = () => {
  const [formJobs, setFormJobs] = useState<FormJob[]>([]);
  const [photoUri, setPhotoUri] = useState("");

  return {
    formJobs,
    setFormJobs,
    photoUri,
    setPhotoUri
  };
};
