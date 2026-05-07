import { FC } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { ChevronRight, Hardhat } from '../shared/Icons';
import { Label } from '../shared';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../shared';
import { Project } from '../../types';
import { useAuth } from '../../context/auth/AuthContext';
import { fontColor2 } from '../../constants';
import { navigate } from '../../navigation/navigate';

interface ProjectsListScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectsListScreen'
  >;
}

const ProjectsListScreen: FC<ProjectsListScreenProps> = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { currentUser } = useAuth();

  return (
    <View style={{ paddingTop: top, ...styles.container }}>
      <View style={styles.nav}>
        <Label text={t('sites')} size={24} />
      </View>
      <Divider />
      <FlatList
        style={styles.projects}
        contentContainerStyle={styles.content}
        data={currentUser?.projects}
        renderItem={({ item }) => (
          <ProjectsListItem
            project={item}
            onPress={() => {
              navigate('ProjectDetailScreen', { project: item });
            }}
          />
        )}
      />
    </View>
  );
};

interface ProjectsListItemProps {
  project: Project;
  onPress: () => void;
}

const ProjectsListItem: FC<ProjectsListItemProps> = ({ project, onPress }) => {
  return (
    <>
      <TouchableOpacity style={styles.project} onPress={onPress}>
        <View style={styles.projectInfo}>
          <View style={styles.icon}>
            <Hardhat size={30} />
          </View>
          <Label text={project.name} />
        </View>
        <ChevronRight />
      </TouchableOpacity>
      <Divider light />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  nav: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
  },
  createButton: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
  projects: {
    flex: 1,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  project: {
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 12,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  projectDivider: {
    backgroundColor: fontColor2,
  },
});

export default ProjectsListScreen;
