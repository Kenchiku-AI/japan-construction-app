import { FC, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import { buttonColor, fontFamily } from '../../constants';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: FC<ButtonProps> = ({
  label,
  variant,
  onPress,
  disabled,
  style,
}) => {
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
      <Text style={labelStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryContainer: {
    backgroundColor: buttonColor,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    color: 'white',
    fontFamily,
    fontSize: 18,
  },
  secondaryContainer: {
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    borderColor: buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryLabel: {
    color: buttonColor,
    fontFamily,
    fontSize: 18,
  },
  tertiaryContainer: {},
  tertiaryLabel: {
    color: buttonColor,
    fontFamily,
    fontSize: 18,
  },
});
