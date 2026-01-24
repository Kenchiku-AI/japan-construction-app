import { FC } from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackNavigationParams } from '../../navigation/AuthStack';
import { ModalNav } from '../shared/ModalNav';

interface ForgotPasswordScreenProps {
  navigation: NativeStackNavigationProp<
    AuthStackNavigationParams,
    'ForgotPasswordScreen'
  >;
}

const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = () => {
  return (
    <View>
      <ModalNav />
    </View>
  );
};

export default ForgotPasswordScreen;
