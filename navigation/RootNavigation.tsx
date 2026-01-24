import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import RecordScreen from '../components/record/RecordScreen';

export type RootStackNavigationParams = {
  Tabs: undefined;
  RecordScreen: undefined;
};

export const RootStack: FC = () => {
  const Stack = createNativeStackNavigator<RootStackNavigationParams>();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: 'fullScreenModal' }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="RecordScreen" component={RecordScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
