import { FC } from 'react';
import { Project } from '../types';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ProjectsListScreen from '../components/projects/ProjectsListScreen';

export type ProjectsStackNavigationParams = {
  ProjectsListScreen: undefined;
  ProjectDetailScreen: {
    project: Project;
  };
};

const ProjectsStack: FC = () => {
  const Stack = createNativeStackNavigator<ProjectsStackNavigationParams>();
  const screenOptions: NativeStackNavigationOptions = {
    headerTitle: '',
    headerBackButtonDisplayMode: 'minimal',
    headerTintColor: 'black',
  };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ProjectsListScreen" component={ProjectsListScreen} />
    </Stack.Navigator>
  );
};

export default ProjectsStack;
