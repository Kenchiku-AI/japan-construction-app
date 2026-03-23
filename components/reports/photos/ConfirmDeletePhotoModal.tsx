import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../shared';
import { StyleSheet, View } from 'react-native';
import { errorColor1, fontColor2 } from '../../../constants';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const ConfirmDeletePhotoModal: FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('confirm_delete')}
      subtitle={t('confirm_delete_photo_description')}
    >
      <View style={styles.confirmDeleteButtons}>
        <Button label={t('delete_photo')} onPress={onDelete} />
        <Button variant="secondary" label={t('cancel')} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    gap: 10,
  },
  date: {
    marginTop: 10,
    color: fontColor2,
  },
  buttons: {
    gap: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    marginLeft: -5,
    marginRight: 5,
  },
  deleteButton: {
    borderColor: errorColor1,
    width: '50%',
  },
  deleteButtonText: {
    color: errorColor1,
  },
  confirmDeleteButtons: {
    gap: 10,
    marginTop: 20,
  },
  tagButton: {
    width: '50%',
  },
  image: {
    alignItems: 'center',
  },
});
