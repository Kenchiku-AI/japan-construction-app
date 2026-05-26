import { FC } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../shared';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Microphone } from '../shared/Icons';
import { fontColor2 } from '../../constants';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
}

const PermissionModal: FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  status,
}) => {
  const { t } = useTranslation();
  const isBlocked = status === 'blocked';

  return (
    <Modal
      title={isBlocked ? t('mic_blocked') : t('microphone_permission_required')}
      subtitle={
        isBlocked
          ? t('mic_blocked_description')
          : t('microphone_permission_required_description')
      }
      isOpen={isOpen}
      onClose={onClose}
    >
      <View style={styles.image}>
        <Microphone size={80} color={fontColor2} />
      </View>
      <Button
        label={isBlocked ? t('OK') : t('continue')}
        onPress={async () => {
          if (isBlocked) {
            onClose();
            return;
          }

          if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            );
          } else if (Platform.OS === 'ios') {
            await request(PERMISSIONS.IOS.MICROPHONE);
          }

          onClose();
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});

export default PermissionModal;
