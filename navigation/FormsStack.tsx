import { FC } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import FormsListScreen from '../components/forms/FormsListScreen';
import FormDetailScreen from '../components/forms/FormDetailScreen';
import { FormJob } from '../types';

export type FormsStackNavigationParams = {
  FormsListScreen: undefined;
  FormDetailScreen: {
    formJobId: string;
  };
};

const FormsStack: FC = () => {
  const Stack = createNativeStackNavigator<FormsStackNavigationParams>();
  const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="FormsListScreen" component={FormsListScreen} />
      <Stack.Screen name="FormDetailScreen" component={FormDetailScreen} />
    </Stack.Navigator>
  );
};

export default FormsStack;
