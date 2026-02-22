import { useState } from 'react';

export const useSettingsData = () => {
  const [reportOutputLanguage, setReportOutputLanguage] = useState('English');

  return {
    reportOutputLanguage,
    setReportOutputLanguage,
  };
};
