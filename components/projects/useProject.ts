import { useCallback, useEffect, useState } from 'react';
import { Project } from '../../types';
import { useApi } from '../../services/api/useApi';
import { useTranslation } from 'react-i18next';

export const useProject = (projectId: string) => {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project>();
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const api = useApi();

  useEffect(() => {
    getProject(projectId);
  }, [projectId]);

  const getProject = useCallback(
    async (projectId: string) => {
      setLoading(true);

      try {
        const response = await api.getProject(projectId);
        setProject(response);
      } catch (err) {
        setError(t('get_project_error'));
      }

      setLoading(false);
    },
    [api],
  );

  const updateProject = useCallback(
    async (request: UpdateProjectRequest) => {
      // if (!project) return;
      // setLoading(true);
      // try {
      //   const response = await api.updateProject(project.id, request);
      //   setProject(response);
      // } catch (err) {
      //   showModal({
      //     title: t('error'),
      //     subtitle: t('get_project_error_descrip'),
      //   });
      //   if (currentUser?.role === UserRole.Admin) {
      //     router.replace('/projects');
      //   } else {
      //     router.replace('/');
      //   }
      // }
      // setLoading(false);
    },
    [project, api],
  );

  return {
    loading,
    project,
    updateProject,
    error,
    setError,
  };
};
