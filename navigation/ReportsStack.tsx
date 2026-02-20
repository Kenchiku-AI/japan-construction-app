import { FC } from 'react';
import { Report } from '../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportsListScreen from '../components/reports/ReportsListScreen';
import ReportDetailScreen from '../components/reports/ReportDetailScreen';

export type ReportsStackNavigationParams = {
  ReportsListScreen: undefined;
  ReportDetailScreen: {
    reportId: string;
    reportName: string;
  };
};

const ReportsStack: FC = () => {
  const Stack = createNativeStackNavigator<ReportsStackNavigationParams>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsListScreen" component={ReportsListScreen} />
      <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
};

export default ReportsStack;
