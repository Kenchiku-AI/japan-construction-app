import { FC, useEffect } from 'react';
import {
  createBottomTabNavigator,
  BottomTabBar,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProjectsStack from './ProjectsStack';
import ReportsStack from './ReportsStack';
import UserStack from './UserStack';
import {
  aiPolicyShownKey,
  buttonColor,
  fontColor2,
  fontFamily,
} from '../constants';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Hardhat,
  HarhatFilled,
  Reports,
  ReportsFilled,
  User,
  UserFilled,
} from '../components/shared/Icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useSpeech } from '../context/speech/SpeechContext';
import { useModal } from '../context/modal/ModalContext';
import AudioVisualizer from '../components/shared/AudioVisualizer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNavigationParams } from './navigate';

export type TabsNavigationParams = {
  ProjectsStack: undefined;
  ReportsStack: undefined;
  UserStack: undefined;
};

interface TabsProps {
  navigation: NativeStackNavigationProp<RootNavigationParams, 'Tabs'>;
}

const Tabs: FC<TabsProps> = ({ navigation }) => {
  const Tabs = createBottomTabNavigator<TabsNavigationParams>();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const aiPolicyShown = await AsyncStorage.getItem(aiPolicyShownKey);
      if (aiPolicyShown) return;

      AsyncStorage.setItem(aiPolicyShownKey, 'true');

      setTimeout(() => {
        navigation.navigate('AIPolicyScreen');
      }, 500);
    })();
  }, []);

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { ...styles.tabBar, height: bottom + 80 },
        tabBarActiveTintColor: buttonColor,
        tabBarInactiveTintColor: fontColor2,
        tabBarLabelStyle: styles.label,
      }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="ReportsStack"
        options={{
          title: t('reports'),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ReportsFilled color={buttonColor} />
            ) : (
              <View style={styles.unfocused}>
                <Reports color={fontColor2} />
              </View>
            ),
          tabBarIconStyle: styles.icon,
        }}
        component={ReportsStack}
      />
      <Tabs.Screen
        name="ProjectsStack"
        options={{
          title: t('projects'),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HarhatFilled color={buttonColor} />
            ) : (
              <Hardhat color={fontColor2} />
            ),
          tabBarIconStyle: styles.icon,
        }}
        component={ProjectsStack}
      />
      <Tabs.Screen
        name="UserStack"
        options={{
          title: t('user'),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <UserFilled size={36} color={buttonColor} />
            ) : (
              <View style={styles.unfocused}>
                <User size={32} color={fontColor2} />
              </View>
            ),
          tabBarIconStyle: styles.icon,
        }}
        component={UserStack}
      />
    </Tabs.Navigator>
  );
};

const TabBar = (props: BottomTabBarProps) => {
  const { isSpeaking } = useSpeech();
  const { isModalShown, fadeOpacity } = useModal();
  const isFadeShown = isSpeaking || isModalShown;

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));

  return (
    <View>
      <Animated.View
        style={[styles.fade, fadeStyle]}
        pointerEvents={isFadeShown ? undefined : 'none'}
      >
        {isSpeaking && <AudioVisualizer />}
      </Animated.View>
      <BottomTabBar {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    borderTopColor: 'transparent',
    backgroundColor: '#F8F9F9',
    marginBottom: 6,
  },
  icon: {
    height: 45,
    width: 45,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontFamily,
  },
  unfocused: {
    width: 40,
    marginTop: 3.2,
  },
  fade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#00000080',
    zIndex: 200,
  },
  cancelButton: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tabs;
