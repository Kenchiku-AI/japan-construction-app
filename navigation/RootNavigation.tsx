import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import CameraScreen from '../components/camera/CameraScreen';
import { PhotoDetailScreen } from '../components/reports/photos/PhotoDetailScreen';
import { FormJob, ReportImage } from '../types';
import AIPolicyScreen from '../components/aiPolicy/AIPolicyScreen';
import FormDetailScreen from '../components/forms/FormDetailScreen';

export type RootStackNavigationParams = {
  Tabs: undefined;
  CameraScreen: {
    reportId?: string;
  };
  PhotoDetailScreen: {
    image: ReportImage;
    companyId: string;
    disabled?: boolean;
  };
  FormDetailScreen: {
    formJob: FormJob;
  };
  AIPolicyScreen: undefined;
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
      <Stack.Screen name="FormDetailScreen" component={FormDetailScreen} />
      <Stack.Screen
        name="AIPolicyScreen"
        component={AIPolicyScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
