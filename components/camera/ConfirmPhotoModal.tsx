import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../shared';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import { PhotoFile } from 'react-native-vision-camera';
import { useModal } from '../../context/modal/ModalContext';

interface ConfirmPhotoModalProps {
  photo?: PhotoFile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmPhotoModal: FC<ConfirmPhotoModalProps> = ({
  photo,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { fadeOpacity } = useModal();

  const height = useMemo(() => {
    if (!photo) return undefined;

    const isPortrait = photo.orientation.includes('portrait');
    const factor = isPortrait
      ? photo.width / photo.height
      : photo.height / photo.width;

    const photoWidth = width - 64;
    const photoHeight = factor * photoWidth;
    return photoHeight + 320;
  }, [photo, width]);

  return (
    <Modal
      title={t('confirm_photo')}
      subtitle={t('confirm_photo_description')}
      isOpen={isOpen}
      onClose={onClose}
      height={height}
    >
      <View style={styles.photo}>
        {photo && (
          <Image
            style={{ flex: 1 }}
            resizeMode="contain"
            source={{ uri: `file://${photo.path}` }}
          />
        )}
      </View>
      <View style={styles.buttons}>
        <Button
          label={t('confirm')}
          onPress={() => {
            fadeOpacity.value = 0;
            onConfirm();
          }}
        />
        <Button variant="secondary" label={t('cancel')} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttons: {
    gap: 10,
  },
  photo: {
    flex: 1,
  },
});
