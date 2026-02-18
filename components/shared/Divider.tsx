import { FC } from 'react';
import { View, ViewStyle } from 'react-native';

interface DividerProps {
  style?: ViewStyle;
}

export const Divider: FC<DividerProps> = ({ style }) => {
  return (
    <View
      style={{
        height: 0.75,
        width: '100%',
        backgroundColor: 'black',
        ...style,
      }}
    />
  );
};
