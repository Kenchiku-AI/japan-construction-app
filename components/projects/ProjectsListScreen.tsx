import { FC, useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { SectionList, StyleSheet } from 'react-native';
import { bgColor100 } from '../../constants';

interface ProjectsListScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectsListScreen'
  >;
}

const ProjectsListScreen: FC<ProjectsListScreenProps> = () => {
  const canAddProject = true;

  useEffect(() => {}, [canAddProject]);

  return (
    <SectionList
      // style={styles.container}
      contentContainerStyle={styles.container}
      sections={[]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProjectsListScreen;
