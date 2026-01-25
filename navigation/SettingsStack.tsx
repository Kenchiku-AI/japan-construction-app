import { FC } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import SettingsScreen from '../components/settings/SettingsScreen';
import { buttonColor } from '../constants';

export type SettingsStackNavigationParams = {
  SettingsScreen: undefined;
};

const SettingsStack: FC = () => {
  const Stack = createNativeStackNavigator<SettingsStackNavigationParams>();
  const screenOptions: NativeStackNavigationOptions = {
    headerTitle: '',
    headerBackButtonDisplayMode: 'minimal',
    headerTintColor: buttonColor,
    headerShadowVisible: false,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
