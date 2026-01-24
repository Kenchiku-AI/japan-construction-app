import { FC } from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';

interface ReportsListScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportsListScreen'
  >;
}

const ReportsListScreen: FC<ReportsListScreenProps> = () => {
  return <View></View>;
};

export default ReportsListScreen;
