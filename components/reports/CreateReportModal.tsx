import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal } from '../shared';
import { StyleSheet, View } from 'react-native';
import { useReportTemplates } from './useReportTemplates';
import { Select } from '../shared/Select';
import { CreateReportRequest, ReportParentType } from '../../types';
import { useAuth } from '../../context/auth/AuthContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

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
  const [requireProjectId, setRequireProjectId] = useState(false);
  const hasEditedName = useRef(false);
  const projectHeight = useSharedValue(0);
  const projectOpacity = useSharedValue(0);

  useEffect(() => {
    const template = reportTemplates?.find(t => t.id === templateId);
    if (!template) return;

    if (!name || !hasEditedName.current) {
      const today = new Date();
      setName(`${template.name} (${today.toLocaleDateString('en-US')})`);
      hasEditedName.current = false;
    }

    if (forceProjectId) return;

    const isProjectType = template.parent_type === ReportParentType.Project;
    setRequireProjectId(isProjectType);
    projectHeight.value = withTiming(isProjectType ? 70 : 0, { duration: 75 });
    projectOpacity.value = withTiming(isProjectType ? 1 : 0, { duration: 75 });

    if (!isProjectType) {
      setProjectId('');
    }
  }, [templateId, reportTemplates]);

  const reset = () => {
    setName('');
    setTemplateId('');
    setProjectId('');
    setRequireProjectId(false);
    projectHeight.value = 0;
    projectOpacity.value = 0;
    hasEditedName.current = false;
  };

  const templateOptions = useMemo(() => {
    if (!reportTemplates) return [];
    return reportTemplates.map(t => ({ label: t.name, value: t.id }));
  }, [reportTemplates]);

  const projectOptions = useMemo(
    () =>
      currentUser?.projects?.map(p => ({
        label: p.name,
        value: p.id,
      })) ?? [],
    [currentUser?.projects],
  );

  const projectStyle = useAnimatedStyle(() => ({
    height: projectHeight.value,
    opacity: projectOpacity.value,
    zIndex: 1000,
  }));

  const parentId = useMemo(() => {
    if (forceProjectId) return forceProjectId;
    if (requireProjectId) return projectId;
    return currentUser?.company?.id;
  }, [forceProjectId, requireProjectId, projectId, currentUser?.company]);

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
      <View style={styles.fields}>
        <Select
          options={templateOptions}
          value={templateId}
          setValue={setTemplateId}
          placeholder={t('report_template')}
          style={styles.select}
        />
        <Animated.View style={[projectStyle]}>
          <Select
            options={projectOptions}
            value={projectId}
            setValue={setProjectId}
            placeholder={t('project')}
            style={styles.select}
            disabled={!projectOptions.length}
          />
        </Animated.View>
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
          onSubmit({
            template_id: templateId,
            parent_id: parentId!,
            name,
          });

          reset();
        }}
        disabled={!templateId || !parentId || !name}
      />
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
