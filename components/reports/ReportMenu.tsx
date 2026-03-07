import { FC, ReactNode, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useModal } from '../../context/modal/ModalContext';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { bgColor1, errorColor1 } from '../../constants';
import { Divider, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onChangeName: () => void;
}

export const ReportMenu: FC<ReportMenuProps> = ({
  isOpen,
  onClose,
  onDelete,
  onChangeName,
}) => {
  const opacity = useSharedValue(0);
  const { setIsModalShown, fadeOpacity } = useModal();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

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

    opacity.value = withTiming(isOpen ? 1 : 0, {
      duration: 200,
    });
    fadeOpacity.value = withTiming(isOpen ? 1 : 0, {
      duration: 200,
    });
  }, [isOpen]);

  const onPressClose = () => {
    setIsModalShown(false);
    onClose();
  };

  return (
    <Animated.View
      style={[style, styles.container]}
      pointerEvents={isOpen ? undefined : 'none'}
      onTouchEnd={onPressClose}
    >
      <View style={{ ...styles.triangle, marginTop: top + 36 }} />
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={onChangeName}>
          <Label text={t('change_report_name')} />
        </TouchableOpacity>
        <Divider light />
        <TouchableOpacity style={styles.button} onPress={onDelete}>
          <Label text={t('delete_report')} style={{ color: errorColor1 }} />
        </TouchableOpacity>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#00000080',
    zIndex: 100000,
  },
  content: {
    backgroundColor: bgColor1,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: '100%',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: bgColor1,
    alignSelf: 'flex-end',
  },
  button: {
    height: 70,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
