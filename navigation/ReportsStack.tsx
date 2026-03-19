import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportsListScreen from '../components/reports/ReportsListScreen';
import ReportDetailScreen from '../components/reports/ReportDetailScreen';
import ReportPhotosScreen from '../components/reports/photos/ReportPhotosScreen';

export type ReportsStackNavigationParams = {
  ReportsListScreen: undefined;
  ReportDetailScreen: {
    reportId: string;
    reportName: string;
  };
  ReportPhotosScreen: {
    reportId: string;
  };
};

const ReportsStack: FC = () => {
  const Stack = createNativeStackNavigator<ReportsStackNavigationParams>();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsListScreen" component={ReportsListScreen} />
      <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} />
      <Stack.Screen name="ReportPhotosScreen" component={ReportPhotosScreen} />
    </Stack.Navigator>
  );
};

export default ReportsStack;
