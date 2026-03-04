import { FC } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { fontColor1, fontColor2, fontFamily } from '../../constants';

interface LabelProps {
  text: string;
  size?: number;
  light?: boolean;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
}

export const Label: FC<LabelProps> = ({
  text,
  size,
  light,
  style,
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
}) => {
  return (
    <Text
      style={{
        fontFamily,
        fontSize: size ?? 18,
        color: light ? fontColor2 : fontColor1,
        ...style,
      }}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      numberOfLines={numberOfLines}
      minimumFontScale={minimumFontScale}
    >
      {text}
    </Text>
  );
};
