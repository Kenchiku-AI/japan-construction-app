import { FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Heading, Input, Button, Label, Modal } from '../shared';
import { useTranslation } from 'react-i18next';
import { buttonColor, emailRegex } from '../../constants';
import { useSignup } from './useSignUp';
import { ChevronLeft } from '../shared/Icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackNavigationParams } from '../../navigation/AuthStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Loader } from '../shared/Loader';

interface SignUpScreenProps {
  navigation: NativeStackNavigationProp<
    AuthStackNavigationParams,
    'SignUpScreen'
  >;
}

const SignUpScreen: FC<SignUpScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const { t } = useTranslation();
  const { loading, signup, showError, setShowError } = useSignup();
  const { top } = useSafeAreaInsets();

  return (
    <>
      <View
        style={{
          ...styles.container,
          paddingTop: top,
        }}
      >
        <View style={styles.navContainer}>
          <View style={styles.nav}>
            <View style={styles.navLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <ChevronLeft color={buttonColor} size={20} />
                <Label text={t('login')} style={{ color: buttonColor }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={{
              ...styles.content,
              paddingBottom: top + 20,
            }}
          >
            <Heading title={t('sign_up')} subtitle={t('sign_up_description')} />
            <View style={styles.fields}>
              <Input
                placeholder={t('first_name')}
                onChange={t => {
                  setFirstName(t);
                }}
              />
              <Input
                placeholder={t('last_name')}
                onChange={t => {
                  setLastName(t);
                }}
              />
              <Input
                placeholder={t('email')}
                onChange={t => {
                  setEmail(t);
                  setIsEmailInvalid(false);
                }}
                error={isEmailInvalid}
              />
              <Input
                placeholder={t('password')}
                onChange={t => {
                  setPassword(t);
                  setIsPasswordInvalid(false);
                }}
                error={isPasswordInvalid}
                secureTextEntry
              />
              <Input
                placeholder={t('confirm_password')}
                onChange={t => {
                  setConfirmPassword(t);
                  setIsPasswordInvalid(false);
                }}
                error={isPasswordInvalid}
                secureTextEntry
              />
            </View>
            <Button
              label={t('sign_up')}
              onPress={async () => {
                if (!emailRegex.test(email)) {
                  setIsEmailInvalid(true);
                  return;
                }

                if (password !== confirmPassword) {
                  setIsPasswordInvalid(true);
                  return;
                }

                if (password.length < 8) {
                  setIsPasswordInvalid(true);
                  return;
                }

                await signup(firstName, lastName, email, password);
              }}
              disabled={!firstName || !lastName || !email || !password}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {loading && <Loader />}
      <Modal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title={t('error')}
        subtitle={t('sign_up_error')}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  navContainer: {
    paddingHorizontal: 16,
  },
  nav: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
  },
  backButton: {
    paddingRight: 18,
    flexDirection: 'row',
    gap: 10,
  },
  fields: {
    marginVertical: 20,
    gap: 10,
  },
});

export default SignUpScreen;
