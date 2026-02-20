import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal } from '../shared';
import { StyleSheet, View } from 'react-native';
import { useReportTemplates } from './useReportTemplates';
import { Select } from '../shared/Select';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const CreateReportModal: FC<CreateReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const { loading, reportTemplates } = useReportTemplates();
  const [templateId, setTemplateId] = useState('');
  const [name, setName] = useState('');

  const reset = () => {
    setTemplateId('');
    setName('');
  };

  const templateOptions = useMemo(() => {
    if (!reportTemplates) return [];
    return reportTemplates.map(t => ({ label: t.name, value: t.id }));
  }, [reportTemplates]);

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
          placeholder={t('template')}
        />
        <Input
          placeholder={t('name')}
          value={name}
          onChange={n => setName(n)}
        />
      </View>
      <Button
        label={t('create')}
        onPress={() => {
          reset();
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  fields: {
    marginVertical: 20,
    gap: 10,
  },
});
