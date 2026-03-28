'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportImageTagResponse } from '../../../types';
import { useApi } from '../../../services/api/useApi';

export const useTags = (companyId: string) => {
  const [tags, setTags] = useState<ReportImageTagResponse[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    getTags();
  }, []);

  const getTags = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getTags(companyId);
      if (response) setTags(response);
    } catch (err) {
      setError(t('get_tags_error'));
    }

    setLoading(false);
  }, [companyId]);

  return {
    tags,
    loading,
    error,
  };
};
