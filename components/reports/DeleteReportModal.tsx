import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../shared';
import { StyleSheet, View } from 'react-native';
import { errorColor1 } from '../../constants';

interface DeleteReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteReportModal: FC<DeleteReportModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('delete_report')}
      subtitle={t('delete_report_description')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <View style={styles.buttons}>
        <Button label={t('delete_report')} onPress={onDelete} />
        <Button variant="secondary" label={t('cancel')} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
    gap: 10,
  },
});
