import { FC } from 'react';
import { Text, ViewStyle } from 'react-native';
import { fontColor1, fontColor2, fontFamily } from '../../constants';

interface LabelProps {
  text: string;
  size?: number;
  light?: boolean;
  style?: ViewStyle;
}

export const Label: FC<LabelProps> = ({ text, size, light, style }) => {
  return (
    <Text
      style={{
        fontFamily,
        fontSize: size ?? 18,
        color: light ? fontColor1 : fontColor2,
        ...style,
      }}
    >
      {text}
    </Text>
  );
};
