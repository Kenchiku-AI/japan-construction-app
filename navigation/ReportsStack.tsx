import { FC } from 'react';
import { DailyReport } from '../types';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ReportsListScreen from '../components/reports/ReportsListScreen';
import DailyReportDetailScreen from '../components/reports/DailyReportDetailScreen';
import { buttonColor } from '../constants';

export type ReportsStackNavigationParams = {
  ReportsListScreen: undefined;
  DailyReportDetailScreen: {
    report: DailyReport;
  };
};

const ReportsStack: FC = () => {
  const Stack = createNativeStackNavigator<ReportsStackNavigationParams>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsListScreen" component={ReportsListScreen} />
      <Stack.Screen
        name="DailyReportDetailScreen"
        component={DailyReportDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ReportsStack;
