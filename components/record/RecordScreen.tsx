import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackNavigationParams } from '../../navigation/RootNavigation';
import { useTranslation } from 'react-i18next';
import { useRecord } from './useRecord';

interface RecordScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackNavigationParams,
    'RecordScreen'
  >;
}

const RecordScreen: FC<RecordScreenProps> = ({ navigation }) => {
  const { start, cancel, submit } = useRecord();
  const { t } = useTranslation();

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default RecordScreen;
