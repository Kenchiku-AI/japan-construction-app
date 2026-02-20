import { FC } from 'react';
import { Text, ViewStyle } from 'react-native';
import { fontColor1, fontColor2, fontFamily } from '../../constants';

interface LabelProps {
  text: string;
  size?: number;
  light?: boolean;
  style?: ViewStyle;
  numberOfLines?: number;
}

export const Label: FC<LabelProps> = ({
  text,
  size,
  light,
  style,
  numberOfLines,
}) => {
  return (
    <Text
      style={{
        fontFamily,
        fontSize: size ?? 18,
        color: light ? fontColor2 : fontColor1,
        ...style,
      }}
      numberOfLines={numberOfLines}
    >
      {text}
    </Text>
  );
};
