import { FC } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { View } from 'react-native';

interface DailyReportDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'DailyReportDetailScreen'
  >;
}

const DailyReportDetailScreen: FC<DailyReportDetailScreenProps> = () => {
  return <View></View>;
};

export default DailyReportDetailScreen;
