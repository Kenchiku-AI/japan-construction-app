import { DefaultTheme } from '@react-navigation/native';
import { bgColor } from '../constants';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: bgColor,
  },
};
