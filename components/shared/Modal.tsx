import { FC, ReactNode } from 'react';
import {
  StyleSheet,
  View,
  Modal as RNModal,
  TouchableOpacity,
} from 'react-native';
import { bgColor1 } from '../../constants';
import { useTranslation } from 'react-i18next';
import { Heading } from './Heading';
import { Button } from './Button';
import { Close } from './Icons';

interface ModalProps {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <RNModal animationType="fade" transparent visible={isOpen}>
      <View style={styles.background}>
        <View style={styles.container}>
          <View style={styles.nav}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Close />
            </TouchableOpacity>
          </View>
          {title && <Heading title={title} subtitle={subtitle} />}
          {children ? (
            children
          ) : (
            <div className="mt-10">
              <Button label={t('ok')} onPress={onClose} />
            </div>
          )}
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    padding: 16,
  },
  container: {
    backgroundColor: bgColor1,
    padding: 16,
    borderRadius: 10,
  },
  nav: { justifyContent: 'flex-end' },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: -4,
    marginTop: -4,
    justifyContent: 'center',
  },
});
