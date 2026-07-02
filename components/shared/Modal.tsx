import { FC, ReactNode, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
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
import { bgColor1 } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ModalProps {
  title?: string;
  subtitle?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  fadeSpeed?: number;
  height?: number;
  tabsHidden?: boolean;
}

export const Modal: FC<ModalProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  children,
  fadeSpeed,
  height,
  tabsHidden,
}) => {
  const opacity = useSharedValue(0);
  const { setIsModalShown, fadeOpacity } = useModal();
  const { top, bottom } = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const maxHeight = screenHeight - top - bottom - (tabsHidden ? 0 : 80) - 20;
  const marginTop = tabsHidden ? 0 : top;
  const { t } = useTranslation();

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    return () => {
      setIsModalShown(false);
    };
  }, []);

  useEffect(() => {
    if (isOpen) Keyboard.dismiss();

    setIsModalShown(isOpen);

    const duration = fadeSpeed == null ? 200 : fadeSpeed;
    const newOpacity = isOpen ? 1 : 0;

    opacity.value = withTiming(newOpacity, { duration });
    fadeOpacity.value = withTiming(newOpacity, { duration });
  }, [isOpen]);

  const onPressClose = () => {
    setIsModalShown(false);
    onClose();
  };

  return (
    <Animated.View
      style={[style, styles.container]}
      pointerEvents={isOpen ? undefined : 'none'}
    >
      <View style={{ ...styles.content, maxHeight, height, marginTop }}>
        <View style={styles.nav}>
          <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
            <Close />
          </TouchableOpacity>
        </View>
        {title && <Heading title={title} subtitle={subtitle} />}
        {children ? (
          children
        ) : (
          <Button
            label={t('ok')}
            onPress={onPressClose}
            style={styles.okButton}
          />
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00000080',
    zIndex: 100000,
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
  },
  okButton: {
    marginTop: 36,
  },
});
