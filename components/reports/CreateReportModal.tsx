import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal } from '../shared';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useReportTemplates } from './useReportTemplates';
import { Select } from '../shared/Select';
import { CreateReportRequest, ProjectStatus } from '../../types';
import { useAuth } from '../../context/auth/AuthContext';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreateReportRequest) => void;
  forceProjectId?: string;
}

export const CreateReportModal: FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  forceProjectId,
}) => {
  const { t } = useTranslation();
  const { reportTemplates } = useReportTemplates();
  const { currentUser } = useAuth();
  const [templateId, setTemplateId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [name, setName] = useState('');
  const hasEditedName = useRef(false);

  useEffect(() => {
    const template = reportTemplates?.find(t => t.id === templateId);
    if (!template) return;

    if (!name || !hasEditedName.current) {
      setName(template.name);
      hasEditedName.current = false;
    }
  }, [templateId, reportTemplates]);

  const reset = () => {
    setName('');
    setTemplateId('');
    setProjectId('');
    hasEditedName.current = false;
  };

  const templateOptions = useMemo(() => {
    if (!reportTemplates) return [];
    return reportTemplates.map(t => ({ label: t.name, value: t.id }));
  }, [reportTemplates]);

  const projectOptions = useMemo(() => {
    const projects = currentUser?.projects
      .filter((p) => p.status === ProjectStatus.Active)
      .map((p) => ({
        label: p.name,
        value: p.id,
      })) ?? [];

    return [
      { label: t("none"), value: "none" },
      ...projects
    ]
  }, [currentUser?.projects]);

  return (
    <Modal
      title={t('create_report')}
      subtitle={t('create_report_description')}
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <ScrollView keyboardDismissMode="interactive">
        <View style={styles.fields}>
          <Select
            options={templateOptions}
            value={templateId}
            setValue={setTemplateId}
            placeholder={t('report_template')}
            style={styles.select}
          />
          {!forceProjectId && (
            <Select
              options={projectOptions}
              value={projectId}
              setValue={setProjectId}
              placeholder={t('project')}
              style={styles.select}
              disabled={!projectOptions.length}
            />
          )}
          <Input
            placeholder={t('name')}
            value={name}
            onChange={n => {
              setName(n);
              hasEditedName.current = true;
            }}
          />
        </View>
        <Button
          label={t('create')}
          onPress={() => {
            if (currentUser?.company?.id) {
              const request: CreateReportRequest = {
                template_id: templateId,
                company_id: currentUser.company.id,
                name,
              };

              if (forceProjectId) {
                request.project_id = forceProjectId;
              } else if (!!projectId && projectId !== "none") {
                request.project_id = projectId;
              }

              onSubmit(request);
            }

            reset();
          }}
          disabled={!templateId || !name}
        />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fields: {
    marginVertical: 20,
  },
  select: {
    marginBottom: 10,
  },
});
