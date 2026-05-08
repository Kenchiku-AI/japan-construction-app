import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal } from '../shared';
import { StyleSheet, View } from 'react-native';
import { UpdateProjectRequest } from '../../types';

interface EditReportNameModalProps {
  reportName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: UpdateProjectRequest) => void;
}

export const EditReportNameModal: FC<EditReportNameModalProps> = ({
  reportName,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(reportName);

  useEffect(() => {
    if (isOpen) {
      setName(reportName);
    }
  }, [isOpen]);

  return (
    <Modal
      title={t('edit_name')}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <View style={styles.fields}>
        <Input
          placeholder={t('name')}
          value={name}
          onChange={n => {
            setName(n);
          }}
        />
      </View>
      <Button
        label={t('update')}
        onPress={() => {
          onSubmit({
            name,
          });
        }}
        disabled={!name || name === reportName}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  fields: {
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  description: {
    height: 120,
    justifyContent: 'flex-start',
    paddingTop: 8,
  },
});
