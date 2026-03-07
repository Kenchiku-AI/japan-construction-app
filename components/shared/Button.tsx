import { FC, useMemo } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { buttonColor, fontFamily } from '../../constants';
import { FontStyle } from 'react-native-svg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  iconLeft?: FC;
  iconRight?: FC;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: FC<ButtonProps> = ({
  label,
  variant,
  onPress,
  disabled,
  iconLeft,
  iconRight,
  style,
  textStyle,
}) => {
  const IconLeft = iconLeft;
  const IconRight = iconRight;

  const [containerStyle, labelStyle] = useMemo(() => {
    switch (variant) {
      case 'secondary':
        return [styles.secondaryContainer, styles.secondaryLabel];
      case 'tertiary':
        return [styles.tertiaryContainer, styles.tertiaryLabel];
      default:
        return [styles.primaryContainer, styles.primaryLabel];
    }
  }, [variant]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...containerStyle,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      disabled={disabled}
    >
      {IconLeft && <IconLeft />}
      <Text style={{ ...labelStyle, ...textStyle }}>{label}</Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    backgroundColor: buttonColor,
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: 'row',
  },
  primaryLabel: {
    color: 'white',
    fontFamily,
    fontSize: 18,
  },
  secondaryContainer: {
    borderWidth: 1,
    borderRadius: 10,
    height: 60,
    borderColor: buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 4,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  secondaryLabel: {
    color: buttonColor,
    fontFamily,
    fontSize: 18,
  },
  tertiaryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flexDirection: 'row',
  },
  tertiaryLabel: {
    color: buttonColor,
    fontFamily,
    fontSize: 18,
  },
});
