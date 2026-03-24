import { FC } from 'react';
import { View, ViewStyle } from 'react-native';
import { fontColor1, fontColor2 } from '../../constants';

interface DividerProps {
  light?: boolean;
  style?: ViewStyle;
}

export const Divider: FC<DividerProps> = ({ light, style }) => {
  return (
    <View
      style={{
        height: light ? 0.5 : 1,
        backgroundColor: light ? fontColor2 : fontColor1,
        ...style,
      }}
    />
  );
};
