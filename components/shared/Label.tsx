import { FC } from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { fontColor1, fontFamily } from '../../constants';

interface LabelProps {
  text: string;
  size?: number;
  style?: ViewStyle;
}

export const Label: FC<LabelProps> = ({ text, size, style }) => {
  return (
    <Text
      style={{
        ...styles.text,
        fontSize: size ?? 18,
        ...style,
      }}
    >
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily,
    color: fontColor1,
  },
});
