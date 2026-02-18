import { FC } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { View } from 'react-native';

interface ReportDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportDetailScreen'
  >;
}

const ReportDetailScreen: FC<ReportDetailScreenProps> = () => {
  return <View></View>;
};

export default ReportDetailScreen;
