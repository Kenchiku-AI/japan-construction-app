import { useCallback, useEffect, useState } from 'react';
import { Project, UpdateProjectRequest } from '../../types';
import { useApi } from '../../services/api/useApi';
import { useTranslation } from 'react-i18next';

export const useProject = (projectId: string) => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project>();
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const api = useApi();

  const getProject = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.getProject(projectId);
      setProject(response);
    } catch (err) {
      setError(t('get_project_error'));
    }

    setLoading(false);
  }, [api]);

  const updateProject = useCallback(
    async (request: UpdateProjectRequest) => {
      if (!project) return;

      setLoading(true);

      try {
        const response = await api.updateProject(project.id, request);
        setProject(response);
      } catch (err) {
        setError('update_project_error');
      }
      setLoading(false);
    },
    [project, api],
  );

  return {
    loading,
    getProject,
    project,
    updateProject,
    error,
    setError,
  };
};
