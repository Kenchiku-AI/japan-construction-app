import { FC, useEffect } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
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
}

export const Input: FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  error,
  secureTextEntry,
}) => {
  const paddingTop = useSharedValue(0);
  const opacity = useSharedValue(0);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    paddingTop: paddingTop.value,
  }));

  useEffect(() => {
    const showLabel = value && placeholder;

    paddingTop.value = withTiming(showLabel ? 18 : 0, { duration: 75 });
    opacity.value = withTiming(showLabel ? 1 : 0, { duration: 75 });
  }, [value, placeholder]);

  return (
    <View style={styles.container}>
      {placeholder && (
        <Animated.View style={[styles.label, labelStyle]}>
          <Label text={placeholder} size={12} />
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          inputStyle,
          { backgroundColor: error ? '#FF636326' : '#F2F2F3' },
        ]}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#8E949A"
          selectionColor={buttonColor}
          onChangeText={t => {
            onChange?.(t);
          }}
          style={{
            ...styles.input,
            backgroundColor: error ? '#FF636326' : '#F2F2F3',
          }}
          autoCapitalize="none"
          secureTextEntry={secureTextEntry}
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
