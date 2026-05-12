import { useState } from 'react';

export const useSettingsData = () => {
  const [reportOutputLanguage, setReportOutputLanguage] = useState('日本語');

  return {
    reportOutputLanguage,
    setReportOutputLanguage,
  };
};
