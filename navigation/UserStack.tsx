import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../components/user/UserScreen';

export type UserStackNavigationParams = {
  UserScreen: undefined;
};

const UserStack: FC = () => {
  const Stack = createNativeStackNavigator<UserStackNavigationParams>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserScreen" component={UserScreen} />
    </Stack.Navigator>
  );
};

export default UserStack;
