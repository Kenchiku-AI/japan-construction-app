import { FC } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { buttonColor, fontFamily } from '../../constants';

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
    secureTextEntry={secureTextEntry}
  />
);

const styles = StyleSheet.create({
  input: {
    fontFamily,
    borderWidth: 0,
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 10,
  },
});
