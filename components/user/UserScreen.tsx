import { FC, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackNavigationParams } from '../../navigation/UserStack';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Input, Label, Modal } from '../shared';
import { useAuth } from '../../context/auth/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmLogoutModal } from './ConfirmLogoutModal';
import { useUser } from './useUser';
import { Loader } from '../shared/Loader';

interface UserScreenProps {
  navigation: NativeStackNavigationProp<
    UserStackNavigationParams,
    'UserScreen'
  >;
}

const UserScreen: FC<UserScreenProps> = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const { loading, updateUser, error, setError } = useUser();
  const [firstName, setFirstName] = useState(currentUser?.first_name);
  const [lastName, setLastName] = useState(currentUser?.last_name);
  const [email, setEmail] = useState(currentUser?.email);
  const { top } = useSafeAreaInsets();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const isUpdateDisabled = useMemo(() => {
    if (!firstName || !lastName || !email) return true;

    return (
      currentUser?.first_name === firstName &&
      currentUser?.last_name === lastName &&
      currentUser?.email === email
    );
  }, [firstName, lastName, email, currentUser]);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.container }}>
        <View style={styles.nav}>
          <Label text={t('user')} size={24} numberOfLines={1} />
          <Button
            variant="tertiary"
            label={t('logout')}
            onPress={() => {
              setShowConfirmLogout(true);
            }}
          />
        </View>
        <Divider />
        <ScrollView keyboardDismissMode="interactive">
          <View style={styles.fields}>
            <Input
              placeholder={t('first_name')}
              value={firstName}
              onChange={f => setFirstName(f)}
            />
            <Input
              placeholder={t('last_name')}
              value={lastName}
              onChange={l => setLastName(l)}
            />
            <Input
              placeholder={t('email')}
              value={email}
              onChange={e => setEmail(e)}
            />
            <Input
              placeholder={t('role')}
              value={t(currentUser?.role ?? '')}
              disabled
            />
          </View>
        </ScrollView>
        <Divider light />
        <Button
          label={t('update')}
          onPress={() => {
            updateUser({
              first_name: firstName,
              last_name: lastName,
              email: email,
            });
          }}
          disabled={isUpdateDisabled}
          style={styles.button}
          variant="secondary"
        />
      </View>
      <ConfirmLogoutModal
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={() => {
          setShowConfirmLogout(false);
          logout();
        }}
      />
      <Modal
        isOpen={!!error}
        onClose={() => setError('')}
        title={t('error')}
        subtitle={error}
      />
      {loading && <Loader />}
    </>
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
    paddingHorizontal: 16,
    flex: 1,
  },
  fields: {
    marginTop: 10,
    gap: 10,
  },
  button: {
    marginVertical: 10,
  },
});

export default UserScreen;
