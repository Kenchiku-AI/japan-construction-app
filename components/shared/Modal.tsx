import { FC, ReactNode, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Heading } from './Heading';
import { Button } from './Button';
import { Close } from './Icons';
import { useModal } from '../../context/modal/ModalContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
  const opacity = useSharedValue(0);
  const { setIsModalShown } = useModal();
  const { t } = useTranslation();

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    setIsModalShown(isOpen);

    opacity.value = withTiming(isOpen ? 1 : 0, {
      duration: 200,
    });
  }, [isOpen]);

  return (
    <Animated.View style={style}>
      <View style={styles.container}>
        <View style={styles.content}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  content: {
    backgroundColor: bgColor1,
    padding: 16,
    borderRadius: 10,
    width: '100%',
  },
  nav: { justifyContent: 'flex-end' },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: -4,
    marginTop: -4,
    justifyContent: 'center',
    paddingBottom: 10,
  },
});
