import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ModalNav } from '../shared/ModalNav';
import { Heading, Input, Button } from '../shared';
import { useTranslation } from 'react-i18next';
import { emailRegex } from '../../constants';

const SignUpScreen: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <ModalNav />
      <View style={styles.container}>
        <Heading title={t('sign_up')} subtitle={t('sign_up_description')} />
        <View style={styles.fields}>
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
          onPress={() => {
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
          }}
          disabled={!email || !password}
        />
      </View>
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
    marginTop: 30,
    marginBottom: 20,
    gap: 10,
  },
});

export default SignUpScreen;
