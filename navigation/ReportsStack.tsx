import { FC } from 'react';
import { DailyReport } from '../types';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ReportsListScreen from '../components/reports/ReportsListScreen';
import DailyReportDetailScreen from '../components/reports/DailyReportDetailScreen';

export type ReportsStackNavigationParams = {
  ReportsListScreen: undefined;
  DailyReportDetailScreen: {
    report: DailyReport;
  };
};

const ReportsStack: FC = () => {
  const Stack = createNativeStackNavigator<ReportsStackNavigationParams>();
  const screenOptions: NativeStackNavigationOptions = {
    headerTitle: '',
    headerBackButtonDisplayMode: 'minimal',
    headerTintColor: 'black',
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ReportsListScreen" component={ReportsListScreen} />
      <Stack.Screen
        name="DailyReportDetailScreen"
        component={DailyReportDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ReportsStack;
