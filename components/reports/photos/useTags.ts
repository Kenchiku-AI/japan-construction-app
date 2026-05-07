'use client';

import { useCallback, useEffect, useState } from 'react';
import { ReportImageTagResponse } from '../../../types';
import { useApi } from '../../../services/api/useApi';

export const useTags = (companyId?: string) => {
  const [tags, setTags] = useState<ReportImageTagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    getTags();
  }, []);

  const getTags = useCallback(async () => {
    if (!companyId) return;

    setLoading(true);

    try {
      const response = await api.getTags(companyId);
      if (response) setTags(response);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  return {
    tags,
    loading,
  };
};
