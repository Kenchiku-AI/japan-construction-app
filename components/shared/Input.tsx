import { FC, useEffect, useRef, useState } from 'react';
import {
  Platform,
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
  bgColor1,
  buttonColor,
  errorColor1,
  fontColor1,
  fontColor2,
  fontFamily,
} from '../../constants';
import { Label } from './Label';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from './Icons';

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
  const [isFocused, setIsFocused] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!value);
  const [showText, setShowText] = useState(false);
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
    const topPadding = (style?.paddingTop as number) ?? 0;

    if (showLabel) {
      paddingTop.value = withTiming(topPadding + TOP_PADDING, ANIMATION_CONFIG);
      opacity.value = withTiming(1, ANIMATION_CONFIG);
    } else {
      paddingTop.value = withTiming(topPadding, ANIMATION_CONFIG);
      opacity.value = 0;
    }
  }, [isEmpty, placeholder]);

  useEffect(() => {
    setIsEmpty(!value);
  }, [value]);

  return (
    <View
      style={styles.container}
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
            borderColor: isFocused ? 'black' : bgColor1,
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
            backgroundColor: error ? '#FF636326' : undefined,
            height: style?.height ?? 60,
            paddingTop: 18,
            marginTop: -18,
            marginRight: secureTextEntry ? 30 : 0,
          }}
          autoCapitalize="none"
          autoFocus={false}
          secureTextEntry={secureTextEntry && !showText}
          editable={!disabled}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </Animated.View>
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => {
            setShowText(prev => !prev);
          }}
          style={styles.showPasswordButton}
        >
          {showText ? <Eye /> : <EyeOff />}
        </TouchableOpacity>
      )}
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
    borderWidth: 1,
    justifyContent: 'center',
    height: 60,
  },
  input: {
    fontFamily,
    borderWidth: 0,
    color: fontColor1,
    fontSize: 18,
    overflow: 'visible',
  },
  label: {
    position: 'absolute',
    top: 8,
    left: Platform.OS === 'android' ? 20 : 16,
    zIndex: 1,
  },
  clear: {
    position: 'absolute',
    paddingRight: 8,
    top: -6,
    height: 40,
    justifyContent: 'center',
    right: 0,
    zIndex: 2,
  },
  clearText: {
    color: errorColor1,
    fontFamily,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 0,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
});
