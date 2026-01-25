import { FC } from 'react';
import { Project } from '../types';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import ProjectsListScreen from '../components/projects/ProjectsListScreen';
import { buttonColor, fontColor1, fontFamily } from '../constants';

export type ProjectsStackNavigationParams = {
  ProjectsListScreen: undefined;
  ProjectDetailScreen: {
    project: Project;
  };
};

const ProjectsStack: FC = () => {
  const Stack = createNativeStackNavigator<ProjectsStackNavigationParams>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectsListScreen" component={ProjectsListScreen} />
    </Stack.Navigator>
  );
};

export default ProjectsStack;
