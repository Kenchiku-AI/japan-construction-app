import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { bgColor1, fontColor1 } from '../../constants';

export const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={fontColor1} />
  </View>
);

const styles = StyleSheet.create({
  container: {
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
});
