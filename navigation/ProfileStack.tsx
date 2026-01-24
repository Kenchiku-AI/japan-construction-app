import { FC } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ProfileScreen from '../components/profile/ProfileScreen';

export type ProfileStackNavigationParams = {
  ProfileScreen: undefined;
};

const ProfileStack: FC = () => {
  const Stack = createNativeStackNavigator<ProfileStackNavigationParams>();
  const screenOptions: NativeStackNavigationOptions = {
    headerTitle: '',
    headerBackButtonDisplayMode: 'minimal',
    headerTintColor: 'black',
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
