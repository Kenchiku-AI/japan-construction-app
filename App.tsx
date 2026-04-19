import { NavigationContainer } from '@react-navigation/native';
import RootProvider from './context/RootProvider';
import { useAuth } from './context/auth/AuthContext';
import RootNavigation from './navigation/RootNavigation';
import AuthStack from './navigation/AuthStack';
import { theme } from './navigation/theme';
import { ref } from './navigation/navigate';
import './services/localization/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { Loader } from './components/shared/Loader';
import { accessTokenStorageKey, refreshTokenStorageKey } from './constants';
import { useApi } from './services/api/useApi';

const App = () => {
  return (
    <RootProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer theme={theme} ref={ref}>
          <Root />
        </NavigationContainer>
      </SafeAreaProvider>
    </RootProvider>
  );
};

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCurrentUser, updateAccessToken, updateRefreshToken } =
    useAuth();
  const api = useApi();

  useEffect(() => {
    (async () => {
      const refreshCreds = await Keychain.getGenericPassword({
        service: refreshTokenStorageKey,
      });
      const accessCreds = await Keychain.getGenericPassword({
        service: accessTokenStorageKey,
      });

      if (refreshCreds) updateRefreshToken(refreshCreds.password);

      if (accessCreds) {
        updateAccessToken(accessCreds.password);

        try {
          console.log('gettting user');
          const user = await api.getCurrentUser();

          setCurrentUser(user);
        } catch (err) {
          console.log('error getting user', err);
        }
      }

      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return !currentUser ? <AuthStack /> : <RootNavigation />;
};

export default App;
