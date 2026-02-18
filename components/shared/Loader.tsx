import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { bgColor } from '../../constants';

export const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="black" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: bgColor,
    justifyContent: 'center',
    opacity: 0.75,
    zIndex: 100,
  },
});
