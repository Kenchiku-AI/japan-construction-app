import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Close } from './Icons';
import { navigateBack } from '../../navigation/navigate';

export const ModalNav = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigateBack()}>
        <Close />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    alignSelf: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
});
