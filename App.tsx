import { NavigationContainer } from '@react-navigation/native';
import RootProvider from './context/RootProvider';
import { useAuth } from './context/auth/AuthContext';
import RootNavigation from './navigation/RootNavigation';
import AuthStack from './navigation/AuthStack';
import { theme } from './navigation/theme';
import { ref } from './navigation/navigate';
import './services/localization/i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';

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
  const { currentUser } = useAuth();

  return !currentUser ? <AuthStack /> : <RootNavigation />;
};

export default App;
