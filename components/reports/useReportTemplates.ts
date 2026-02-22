import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../services/api/useApi';
import { ReportTemplate } from '../../types';

export const useReportTemplates = () => {
  const [loading, setLoading] = useState(false);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>();
  const api = useApi();
  const { t } = useTranslation();

  useEffect(() => {
    getReportTemplates();
  }, []);

  const getReportTemplates = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getReportTemplates();
      setReportTemplates(response);
    } finally {
      setLoading(false);
    }
  }, [setReportTemplates]);

  return {
    loading,
    reportTemplates,
  };
};
