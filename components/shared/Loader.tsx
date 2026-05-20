import { View, StyleSheet } from 'react-native';
import { bgColor1, fontColor2 } from '../../constants';
import { M3eLoader } from 'material-loader-react-native';
import { FC } from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  color?: string;
}

export const Loader: FC<LoaderProps> = ({ fullScreen = true, color }) => (
  <View
    style={fullScreen ? styles.fullScreenContainer : styles.inlineContainer}
  >
    <M3eLoader
      size={80}
      color={fontColor2}
      duration={3000}
      shapeInterval={1000}
      backgroundColor="#E0F7FA"
      variant="contained"
    />
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
