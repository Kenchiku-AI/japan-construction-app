import { FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackNavigationParams } from '../../navigation/AuthStack';
import { Button, Heading, Input, Label } from '../shared';
import { ChevronLeft } from '../shared/Icons';
import { buttonColor } from '../../constants';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForgotPassword } from './useForgotPassword';
import { Loader } from '../shared/Loader';

interface ForgotPasswordScreenProps {
  navigation: NativeStackNavigationProp<
    AuthStackNavigationParams,
    'ForgotPasswordScreen'
  >;
}

const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { forgotPassword, modalContent, setModalContent, loading } =
    useForgotPassword();

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
            <Heading
              title={t('forgot_password')}
              subtitle={t('forgot_password_description')}
            />
            <View style={styles.fields}>
              <Input
                placeholder={t('email')}
                value={email}
                onChange={t => {
                  setEmail(t);
                }}
              />
            </View>
            <Button
              label={t('send_email')}
              onPress={async () => {
                await forgotPassword(email);
                setEmail('');
              }}
              disabled={!email}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {loading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
    marginBottom: 90,
  },
  fields: {
    marginVertical: 20,
    gap: 10,
  },
});

export default ForgotPasswordScreen;
