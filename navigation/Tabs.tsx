import { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProjectsStack from './ProjectsStack';
import ReportsStack from './ReportsStack';
import ProfileStack from './ProfileStack';
import { buttonColor } from '../constants';
import { StyleSheet } from 'react-native';

export type TabsNavigationParams = {
  ProjectsStack: undefined;
  ReportsStack: undefined;
  ProfileStack: undefined;
};

const Tabs: FC = () => {
  const Tabs = createBottomTabNavigator<TabsNavigationParams>();

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'red',
      }}
    >
      <Tabs.Screen
        name="ProjectsStack"
        options={{ title: 'Projects' }}
        component={ProjectsStack}
      />
      <Tabs.Screen
        name="ReportsStack"
        options={{ title: 'Reports' }}
        component={ReportsStack}
      />
      <Tabs.Screen
        name="ProfileStack"
        options={{ title: 'Profile' }}
        component={ProfileStack}
      />
    </Tabs.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 40,
    borderRadius: 30,
    height: 60,
    marginHorizontal: 20,
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    borderTopWidth: 0,
    borderColor: 'transparent',
  },
});

export default Tabs;
