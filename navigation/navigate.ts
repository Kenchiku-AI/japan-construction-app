import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackNavigationParams } from './RootNavigation';
import { TabsNavigationParams } from './Tabs';
import { ProjectsStackNavigationParams } from './ProjectsStack';
import { ReportsStackNavigationParams } from './ReportsStack';
import { FormsStackNavigationParams } from './FormsStack';

export type RootNavigationParams = RootStackNavigationParams &
  TabsNavigationParams &
  ProjectsStackNavigationParams &
  ReportsStackNavigationParams &
  FormsStackNavigationParams;

export const ref = createRef<NavigationContainerRef<RootNavigationParams>>();

export const navigate = <T extends keyof RootNavigationParams>(
  name: T,
  params?: RootNavigationParams[T],
) => {
  // @ts-expect-error
  ref.current?.navigate(name, params);
};

export const navigateBack = () => {
  ref.current?.goBack();
};
