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

interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  error?: boolean;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export const Input: FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  error,
  secureTextEntry,
  style,
  disabled,
}) => {
  const [isEmpty, setIsEmpty] = useState(!value);
  const paddingTop = useSharedValue(0);
  const opacity = useSharedValue(0);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    paddingTop: paddingTop.value,
  }));

  useEffect(() => {
    const showLabel = !isEmpty && placeholder;

    if (showLabel) {
      paddingTop.value = withTiming(18, { duration: 75 });
      opacity.value = withTiming(1, { duration: 75 });
    } else {
      paddingTop.value = withTiming(0, { duration: 75 });
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
