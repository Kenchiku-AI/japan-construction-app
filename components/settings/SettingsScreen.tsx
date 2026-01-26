import { FC } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackNavigationParams } from '../../navigation/SettingsStack';
import { useTranslation } from 'react-i18next';
import { Button, Heading } from '../shared';
import { useAuthContext } from '../../context/auth/AuthContext';

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<
    SettingsStackNavigationParams,
    'SettingsScreen'
  >;
}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const { t } = useTranslation();
  const { logout } = useAuthContext();

  return (
    <View>
      <Heading style={styles.heading} title={t('settings')} />
      <ScrollView contentContainerStyle={styles.container}>
        <Button
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
  createButton: {
    alignSelf: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  container: {
    padding: 20,
  },
});

export default SettingsScreen;
