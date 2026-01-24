import { FC } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import LoginScreen from '../components/login/LoginScreen';
import SignUpScreen from '../components/signUp/SignUpScreen';
import ForgotPasswordScreen from '../components/forgotPassword/ForgotPasswordScreen';

export type AuthStackNavigationParams = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  ForgotPasswordScreen: undefined;
};

const AuthStack: FC = () => {
  const Stack = createNativeStackNavigator<AuthStackNavigationParams>();
  const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    presentation: 'modal',
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
