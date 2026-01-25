import { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProjectsStack from './ProjectsStack';
import ReportsStack from './ReportsStack';
import SettingsStack from './SettingsStack';
import { buttonColor, fontColor2, fontFamily } from '../constants';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Hardhat,
  HarhatFilled,
  Reports,
  ReportsFilled,
  Settings,
  SettingsFilled,
  User,
  UserFilled,
} from '../components/shared/Icons';

export type TabsNavigationParams = {
  ProjectsStack: undefined;
  ReportsStack: undefined;
  SettingsStack: undefined;
};

const Tabs: FC = () => {
  const Tabs = createBottomTabNavigator<TabsNavigationParams>();
  const { t } = useTranslation();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: buttonColor,
        tabBarInactiveTintColor: fontColor2,
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tabs.Screen
        name="ProjectsStack"
        options={{
          title: t('sites'),
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
        name="SettingsStack"
        options={{
          title: t('settings'),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <SettingsFilled color={buttonColor} />
            ) : (
              <View style={styles.unfocused}>
                <Settings color={fontColor2} />
              </View>
            ),
          tabBarIconStyle: styles.icon,
        }}
        component={SettingsStack}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 16,
    borderRadius: 30,
    height: 80,
    marginHorizontal: 16,
    borderTopWidth: 0,
    backgroundColor: 'white',
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    height: 45,
    width: 45,
  },
  label: {
    fontSize: 16,
    fontFamily,
  },
  unfocused: {
    width: 40,
    marginTop: 3.2,
  },
});

export default Tabs;
