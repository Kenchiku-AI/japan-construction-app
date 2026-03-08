import { FC } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackNavigationParams } from '../../navigation/SettingsStack';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Heading, Label } from '../shared';
import { useAuth } from '../../context/auth/AuthContext';
import { User } from '../shared/Icons';
import { fontColor1, fontColor2, fontFamily } from '../../constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<
    SettingsStackNavigationParams,
    'SettingsScreen'
  >;
}

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top, ...styles.container }}>
      <View style={styles.nav}>
        <Label text={t('settings')} size={24} numberOfLines={1} />
        <Button
          variant="tertiary"
          label={t('logout')}
          onPress={() => {
            logout();
          }}
        />
      </View>
      <Divider />
      <ScrollView>
        <View style={styles.profile}>
          <View style={styles.icon}>
            <User color={fontColor2} />
          </View>
          <View style={styles.profileText}>
            {currentUser?.first_name && currentUser.last_name && (
              <Text style={styles.name}>
                {`${currentUser.first_name} ${currentUser.last_name}`}
              </Text>
            )}
            {currentUser?.email && (
              <Text style={styles.email}>{currentUser.email}</Text>
            )}
          </View>
        </View>
        <Divider light />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: -4,
  },
  container: {
    padding: 20,
  },
  profile: {
    flexDirection: 'row',
    gap: 16,
    height: 64,
    marginTop: 12,
    marginBottom: 16,
    marginLeft: 8,
  },
  icon: {
    height: 64,
    width: 64,
  },
  profileText: { gap: 4, alignSelf: 'center' },
  name: {
    fontFamily,
    fontSize: 18,
    color: fontColor1,
  },
  email: {
    fontFamily,
    fontSize: 16,
    color: fontColor2,
  },
});

export default SettingsScreen;
