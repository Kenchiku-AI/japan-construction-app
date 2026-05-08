import { FC, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackNavigationParams } from '../../navigation/AuthStack';
import { useTranslation } from 'react-i18next';
import { useLogin } from './useLogin';
import { Heading, Input, Button, Modal } from '../shared';
import { Loader } from '../shared/Loader';
import { useSpeech } from '../../context/speech/SpeechContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../shared/Icons';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<
    AuthStackNavigationParams,
    'LoginScreen'
  >;
}

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { resetSpeech } = useSpeech();
  const { loading, login, showError, setShowError } = useLogin();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    resetSpeech();
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, marginTop: top }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <View style={styles.logo}>
            <Logo />
          </View>
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
            {/* <Button
              variant="tertiary"
              label={t('sign_up')}
              onPress={() => {
                navigation.navigate('SignUpScreen');
              }}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && <Loader />}
      <Modal
        title={t('error')}
        subtitle={t('login_error')}
        isOpen={showError}
        onClose={() => {
          setShowError(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    // justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '25%',
    // marginBottom: 60,
    // marginTop: -160,
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
