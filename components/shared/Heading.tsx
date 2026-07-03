import { FC } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { fontColor1, fontColor2, fontColor3, fontFamily } from '../../constants';

interface HeadingProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const Heading: FC<HeadingProps> = ({ title, subtitle, style }) => {
  return (
    <View style={style}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily,
    fontSize: 28,
    color: fontColor1,
    marginBottom: 6,
    includeFontPadding: false
  },
  subtitle: {
    fontFamily,
    fontSize: 18,
    color: fontColor3,
    lineHeight: 24,
    includeFontPadding: false
  },
});
