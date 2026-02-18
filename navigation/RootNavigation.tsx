import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import CreateReportScreen from '../components/reports/CreateReportScreen';

export type RootStackNavigationParams = {
  Tabs: undefined;
  CreateReportScreen: undefined;
};

export const RootStack: FC = () => {
  const Stack = createNativeStackNavigator<RootStackNavigationParams>();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="CreateReportScreen"
        component={CreateReportScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
