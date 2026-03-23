import { FC, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  buttonColor,
  fontColor1,
  fontColor2,
  fontFamily,
} from '../../constants';
import { Label } from './Label';

const TOP_PADDING = 18;
const ANIMATION_CONFIG = { duration: 75 };

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
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
  error,
  secureTextEntry,
  style,
  disabled,
  multiline,
}) => {
  const [isEmpty, setIsEmpty] = useState(!value);
  const paddingTop = useSharedValue(!value ? 0 : TOP_PADDING);
  const opacity = useSharedValue(!value ? 0 : 1);

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
      paddingTop.value = withTiming(0, ANIMATION_CONFIG);
      opacity.value = 0;
    }
  }, [isEmpty, placeholder]);

  useEffect(() => {
    setIsEmpty(!value);
  }, [value]);

  return (
    <View style={styles.container}>
      {placeholder && (
        <Animated.View style={[styles.label, labelStyle]}>
          <Label text={placeholder} size={12} light />
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          inputStyle,
          { backgroundColor: error ? '#FF636326' : '#F2F2F3' },
          style,
        ]}
      >
        <TextInput
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
            backgroundColor: error ? '#FF636326' : '#F2F2F3',
          }}
          autoCapitalize="none"
          autoFocus={false}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : undefined}
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
  },
  label: {
    position: 'absolute',
    top: 8,
    left: 20,
    zIndex: 1,
  },
});
