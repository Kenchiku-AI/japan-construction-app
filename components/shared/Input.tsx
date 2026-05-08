import { FC, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  buttonColor,
  errorColor1,
  fontColor1,
  fontColor2,
  fontFamily,
} from '../../constants';
import { Label } from './Label';
import { useTranslation } from 'react-i18next';

const TOP_PADDING = 18;
const ANIMATION_CONFIG = { duration: 75 };

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  onClear?: () => void;
  error?: boolean;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  log?: boolean;
  multiline?: boolean;
  height?: number;
}

export const Input: FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  onClear,
  error,
  secureTextEntry,
  style,
  disabled,
  multiline,
}) => {
  const inputRef = useRef<any>(null);
  const [isEmpty, setIsEmpty] = useState(!value);
  const paddingTop = useSharedValue(
    !value ? 0 : style?.paddingTop ?? TOP_PADDING,
  );
  const opacity = useSharedValue(!value ? 0 : 1);
  const { t } = useTranslation();

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    paddingTop: paddingTop.value,
  }));

  useEffect(() => {
    const showLabel = !isEmpty && placeholder;

    if (showLabel) {
      paddingTop.value = withTiming(TOP_PADDING, ANIMATION_CONFIG);
      opacity.value = withTiming(1, ANIMATION_CONFIG);
    } else {
      paddingTop.value = withTiming(
        (style?.paddingTop as number) ?? 0,
        ANIMATION_CONFIG,
      );
      opacity.value = 0;
    }
  }, [isEmpty, placeholder]);

  useEffect(() => {
    setIsEmpty(!value);
  }, [value]);

  return (
    <View
      style={styles.container}
      onTouchStart={e => {
        if (e.nativeEvent.locationY > 60) {
          inputRef.current?.focus();
        }
      }}
    >
      {placeholder && (
        <Animated.View style={[styles.label, labelStyle]}>
          <Label text={placeholder} size={12} light />
        </Animated.View>
      )}
      {onClear && !!value && (
        <TouchableOpacity onPress={onClear} style={styles.clear}>
          <Text style={styles.clearText}>{t('clear')}</Text>
        </TouchableOpacity>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          inputStyle,
          {
            backgroundColor: error
              ? '#FF636326'
              : `#F2F2F3${disabled ? '54' : ''}`,
          },
          style,
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={fontColor2}
          selectionColor={buttonColor}
          onChangeText={t => {
            setIsEmpty(!t);
            onChange?.(t);
          }}
          style={{
            ...styles.input,
            backgroundColor: error
              ? '#FF636326'
              : `#F2F2F3${disabled ? '54' : ''}`,
          }}
          autoCapitalize="none"
          autoFocus={false}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          multiline={multiline}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
    height: 60,
  },
  input: {
    fontFamily,
    borderWidth: 0,
    color: fontColor1,
    fontSize: 18,
    lineHeight: 24,
  },
  label: {
    position: 'absolute',
    top: 8,
    left: 20,
    zIndex: 1,
  },
  clear: {
    position: 'absolute',
    paddingHorizontal: 12,
    top: -4,
    height: 40,
    justifyContent: 'center',
    right: 0,
    zIndex: 2,
  },
  clearText: {
    color: errorColor1,
    fontFamily,
  },
});
