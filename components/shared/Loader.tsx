import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { bgColor1, fontColor1 } from '../../constants';
import { FC } from 'react';

interface LoaderProps {
  fullScreen?: boolean;
}

export const Loader: FC<LoaderProps> = ({ fullScreen = true }) => (
  <View
    style={fullScreen ? styles.fullScreenContainer : styles.inlineContainer}
  >
    <ActivityIndicator size="large" color={fontColor1} />
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
