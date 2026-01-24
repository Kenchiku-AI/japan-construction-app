import { FC } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { fontColor1, fontColor2, fontFamily } from '../../constants';

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
    fontSize: 32,
    color: fontColor1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily,
    fontSize: 16,
    color: fontColor2,
  },
});
