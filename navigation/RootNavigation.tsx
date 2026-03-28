import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import CameraScreen from '../components/camera/CameraScreen';
import { PhotoDetailScreen } from '../components/reports/photos/PhotoDetailScreen';
import { ReportImage } from '../types';

export type RootStackNavigationParams = {
  Tabs: undefined;
  CameraScreen: {
    reportId: string;
  };
  PhotoDetailScreen: {
    image: ReportImage;
    companyId: string;
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
      <Stack.Screen name="PhotoDetailScreen" component={PhotoDetailScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
