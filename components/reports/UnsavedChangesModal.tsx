import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../shared';
import { StyleSheet, View } from 'react-native';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onLeave: () => void;
}

export const UnsavedChangesModal: FC<UnsavedChangesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onLeave,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('unsaved_changes')}
      subtitle={t('unsaved_changes_description')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <View style={styles.buttons}>
        <Button label={t('save_and_leave')} onPress={onSave} />
        <Button
          variant="secondary"
          label={t('leave_without_saving')}
          onPress={onLeave}
        />
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
