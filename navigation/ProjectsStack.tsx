import { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProjectsListScreen from '../components/projects/ProjectsListScreen';
import ProjectDetailScreen from '../components/projects/ProjectDetailScreen';
import { ReportsStackNavigationParams } from './ReportsStack';
import ReportDetailScreen from '../components/reports/ReportDetailScreen';
import ReportPhotosScreen from '../components/reports/photos/ReportPhotosScreen';

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
      <Stack.Screen name="ReportDetailScreen" component={ReportDetailScreen} />
      <Stack.Screen name="ReportPhotosScreen" component={ReportPhotosScreen} />
    </Stack.Navigator>
  );
};

export default ProjectsStack;
