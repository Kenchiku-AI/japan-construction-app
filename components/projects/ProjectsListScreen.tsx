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
import { useAuthContext } from '../../context/auth/AuthContext';
import { project } from '../../native.config';
import { fontColor2 } from '../../constants';

interface ProjectsListScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectsListScreen'
  >;
}

const ProjectsListScreen: FC<ProjectsListScreenProps> = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { currentUser } = useAuthContext();

  return (
    <View style={{ paddingTop: top, ...styles.container }}>
      <View style={styles.nav}>
        <Label text={t('sites')} size={24} />
      </View>
      <Divider />
      <FlatList
        contentContainerStyle={styles.content}
        data={currentUser?.projects}
        renderItem={({ item, index }) => (
          <ProjectsListItem
            project={item}
            onPress={() => {}}
            showDivider={index !== 0}
          />
        )}
      />
    </View>
  );
};

interface ProjectsListItemProps {
  project: Project;
  onPress: () => void;
  showDivider?: boolean;
}

const ProjectsListItem: FC<ProjectsListItemProps> = ({
  project,
  onPress,
  showDivider,
}) => {
  return (
    <>
      {showDivider && <Divider style={styles.projectDivider} />}
      <TouchableOpacity style={styles.project} onPress={onPress}>
        <View style={styles.projectInfo}>
          <Hardhat size={30} />
          <Label text={project.name} />
        </View>
        <ChevronRight />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  nav: {
    height: 70,
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
  project: {
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  projectDivider: {
    backgroundColor: fontColor2,
  },
});

export default ProjectsListScreen;
