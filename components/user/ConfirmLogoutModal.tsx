import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../shared';
import { StyleSheet, View } from 'react-native';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('logout')}
      subtitle={t('confirm_logout_description')}
    >
      <View style={styles.buttons}>
        <Button label={t('logout')} onPress={onConfirm} />
        <Button variant="secondary" label={t('cancel')} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttons: {
    gap: 10,
    marginTop: 20,
  },
});
