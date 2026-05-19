import { View, StyleSheet } from 'react-native';
import { bgColor1, fontColor2 } from '../../constants';
import { FC } from 'react';
import { MaterialIndicator } from 'react-native-indicators';

interface LoaderProps {
  fullScreen?: boolean;
  color?: string;
}

export const Loader: FC<LoaderProps> = ({ fullScreen = true, color }) => (
  <View
    style={fullScreen ? styles.fullScreenContainer : styles.inlineContainer}
  >
    <MaterialIndicator color={color ?? fontColor2} />
  </View>
);

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: bgColor1,
    opacity: 0.75,
    zIndex: 10000,
  },
  inlineContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: bgColor1,
  },
});
