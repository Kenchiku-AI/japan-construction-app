import { FC } from 'react';
import { View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackNavigationParams } from '../../navigation/SettingsStack';

interface ProfileScreenProps {
  navigation: NativeStackNavigationProp<
    ProfileStackNavigationParams,
    'ProfileScreen'
  >;
}

const ProfileScreen: FC<ProfileScreenProps> = () => {
  return <View></View>;
};

export default ProfileScreen;
