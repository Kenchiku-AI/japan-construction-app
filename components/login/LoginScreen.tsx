import { FC, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackNavigationParams } from '../../navigation/AuthStack';
import { useTranslation } from 'react-i18next';
import { useLogin } from './useLogin';
import { Heading, Input, Button } from '../shared';
import { Loader } from '../shared/Loader';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<
    AuthStackNavigationParams,
    'LoginScreen'
  >;
}

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, login } = useLogin();
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.container}>
        <Heading title={t('login')} subtitle={t('login_description')} />
        <View style={styles.fields}>
          <Input
            value={email}
            placeholder={t('email')}
            onChange={t => setEmail(t)}
          />
          <Input
            value={password}
            placeholder={t('password')}
            onChange={t => setPassword(t)}
            secureTextEntry
          />
        </View>
        <Button
          label={t('login')}
          onPress={() => {
            Keyboard.dismiss();
            login(email, password);
          }}
          disabled={!email || !password}
        />
        <View style={styles.buttons}>
          <Button
            variant="tertiary"
            label={t('forgot_password')}
            onPress={() => {
              navigation.navigate('ForgotPasswordScreen');
            }}
          />
          <Button
            variant="tertiary"
            label={t('sign_up')}
            onPress={() => {
              navigation.navigate('SignUpScreen');
            }}
          />
        </View>
      </View>
      {loading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
    justifyContent: 'center',
  },
  fields: {
    marginVertical: 20,
    gap: 10,
  },
  buttons: {
    marginTop: 32,
    gap: 30,
    alignItems: 'flex-start',
  },
});

export default LoginScreen;
