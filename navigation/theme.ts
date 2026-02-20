import { DefaultTheme } from '@react-navigation/native';
import { bgColor1 } from '../constants';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: bgColor1,
  },
};
