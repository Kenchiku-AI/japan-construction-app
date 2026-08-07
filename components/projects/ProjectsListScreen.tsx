import { FC, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { ChevronRight, Hardhat } from '../shared/Icons';
import { Label } from '../shared';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider } from '../shared';
import { UserProject } from '../../types';
import { useAuth } from '../../context/auth/AuthContext';
import { fontColor2 } from '../../constants';
import { useApi } from '../../services/api/useApi';

interface ProjectsListScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectsListScreen'
  >;
}

const ProjectsListScreen: FC<ProjectsListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const api = useApi();
  const { currentUser, setCurrentUser } = useAuth();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const user = await api.getCurrentUser();
          setCurrentUser(user);
        } catch (err) {
          console.log('sign up error', err);
        }
      })();
    }, []),
  );

  return (
    <View style={{ paddingTop: top, ...styles.container }}>
      <View style={styles.nav}>
        <Label text={t('project_list')} size={24} />
      </View>
      <Divider />
      <View style={{ flex: 1 }}>
        <FlatList
          style={styles.projects}
          data={currentUser?.projects}
          renderItem={({ item }) => (
            <ProjectsListItem
              project={item}
              onPress={() => {
                navigation.navigate('ProjectDetailScreen', {
                  projectId: item.id,
                  projectName: item.name,
                });
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

interface ProjectsListItemProps {
  project: UserProject;
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
        <ChevronRight size={18} />
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
