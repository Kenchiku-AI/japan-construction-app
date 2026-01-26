import { FC } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackNavigationParams } from '../../navigation/SettingsStack';
import { useTranslation } from 'react-i18next';
import { Button, Heading } from '../shared';
import { useAuthContext } from '../../context/auth/AuthContext';
import { User } from '../shared/Icons';
import { fontColor1, fontColor2, fontFamily } from '../../constants';

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<
    SettingsStackNavigationParams,
    'SettingsScreen'
  >;
}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuthContext();

  return (
    <View>
      <Heading style={styles.heading} title={t('settings')} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
          <View style={styles.icon}>
            <User color={fontColor2} />
          </View>
          <View style={styles.profileText}>
            {currentUser?.first_name && currentUser.last_name && (
              <Text
                style={styles.name}
              >{`${currentUser.first_name} ${currentUser.last_name}`}</Text>
            )}
            {currentUser?.email && (
              <Text style={styles.email}>{currentUser.email}</Text>
            )}
          </View>
        </View>
        <Button
          variant="secondary"
          label={t('logout')}
          onPress={async () => {
            await logout();
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  container: {
    padding: 20,
  },
  profile: {
    flexDirection: 'row',
    gap: 12,
    height: 64,
    marginBottom: 30,
  },
  icon: {
    height: 80,
    width: 64,
  },
  profileText: { gap: 4, alignSelf: 'center' },
  name: {
    fontFamily,
    fontSize: 24,
    color: fontColor1,
  },
  email: {
    fontFamily,
    fontSize: 16,
    color: fontColor2,
  },
});

export default SettingsScreen;
