import { FC } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { buttonColor, fontColor1, fontFamily } from '../../constants';

interface InputProps {
  placeholder?: string;
  onChange?: (text: string) => void;
  error?: boolean;
  secureTextEntry?: boolean;
}

export const Input: FC<InputProps> = ({
  placeholder,
  onChange,
  error,
  secureTextEntry,
}) => (
  <TextInput
    placeholder={placeholder}
    placeholderTextColor="#8E949A"
    selectionColor={buttonColor}
    onChangeText={t => {
      onChange?.(t);
    }}
    style={{
      ...styles.input,
      backgroundColor: error ? '#FF636326' : '#A4A9AE26',
    }}
    autoCapitalize="none"
    secureTextEntry={secureTextEntry}
  />
);

const styles = StyleSheet.create({
  input: {
    fontFamily,
    borderWidth: 0,
    paddingHorizontal: 16,
    height: 60,
    borderRadius: 10,
    color: fontColor1,
    fontSize: 18,
  },
});
