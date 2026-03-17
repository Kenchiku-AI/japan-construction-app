import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import CameraScreen from '../components/camera/CameraScreen';

export type RootStackNavigationParams = {
  Tabs: undefined;
  CameraScreen: {
    reportId: string;
  };
};

export const RootStack: FC = () => {
  const Stack = createNativeStackNavigator<RootStackNavigationParams>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'fullScreenModal',
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
