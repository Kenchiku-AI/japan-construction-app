import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../components/settings/SettingsScreen';

export type SettingsStackNavigationParams = {
  SettingsScreen: undefined;
};

const SettingsStack: FC = () => {
  const Stack = createNativeStackNavigator<SettingsStackNavigationParams>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
