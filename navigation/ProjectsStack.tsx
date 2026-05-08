import { FC } from 'react';
import { Project } from '../types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectsListScreen from '../components/projects/ProjectsListScreen';
import ProjectDetailScreen from '../components/projects/ProjectDetailScreen';
import ReportsStack, { ReportsStackNavigationParams } from './ReportsStack';

export type ProjectsStackNavigationParams = ReportsStackNavigationParams & {
  ProjectsListScreen: undefined;
  ProjectDetailScreen: {
    projectId: string;
    projectName: string;
  };
};

const ProjectsStack: FC = () => {
  const Stack = createNativeStackNavigator<ProjectsStackNavigationParams>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectsListScreen" component={ProjectsListScreen} />
      <Stack.Screen
        name="ProjectDetailScreen"
        component={ProjectDetailScreen}
      />
      <ReportsStack />
    </Stack.Navigator>
  );
};

export default ProjectsStack;
