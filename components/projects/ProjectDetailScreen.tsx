import { FC, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Loader } from '../shared/Loader';
import { Button, Divider, Label, Modal } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Edit, Plus } from '../shared/Icons';
import { buttonColor } from '../../constants';
import { RouteProp } from '@react-navigation/native';
import { useProject } from './useProject';
import { CreateReportModal } from '../reports/CreateReportModal';
import { useReports } from '../reports/useReports';
import { useTranslation } from 'react-i18next';
import { ReportsListItem } from '../reports/ReportsListScreen';
import { EditProjectModal } from './EditProjectModal';
import { ProjectStatus } from '../../types';

interface ProjectDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectDetailScreen'
  >;
  route: RouteProp<ProjectsStackNavigationParams, 'ProjectDetailScreen'>;
}

const ProjectDetailScreen: FC<ProjectDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation();
  const { projectId, projectName } = route.params;
  const { project, getProject, updateProject, loading, error, setError } =
    useProject(projectId);
  const { createReport } = useReports();
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    getProject();
  }, []);

  return (
    <>
      <View
        style={{
          ...styles.container,
          paddingTop: top,
        }}
      >
        <View style={styles.navContainer}>
          <View style={styles.nav}>
            <View style={styles.navLeft}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={navigation.goBack}
              >
                <ChevronLeft color={buttonColor} size={20} />
              </TouchableOpacity>
              <View style={{ flexShrink: 1 }}>
                <Label
                  text={project?.name ?? projectName}
                  style={styles.projectName}
                  numberOfLines={1}
                />
              </View>
            </View>
            {project?.status === ProjectStatus.Active && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setShowEdit(true)}
              >
                <Edit />
              </TouchableOpacity>
            )}
          </View>
          <Divider />
        </View>
        {project && (
          <View style={styles.project}>
            <Label text={project.description} style={styles.description} />
            <View style={styles.reportsHeader}>
              <Label text={t('reports')} style={styles.reportsTitle} />
              {project.status === ProjectStatus.Active && (
                <Button
                  variant="tertiary"
                  label={t('create_report')}
                  onPress={() => {
                    setShowCreateReport(true);
                  }}
                  iconRight={() => <Plus size={30} />}
                />
              )}
            </View>
            <Divider />
            <View style={{ flex: 1 }}>
              <FlatList
                data={project.reports}
                renderItem={({ item }) => (
                  <ReportsListItem
                    report={item}
                    onPress={() => {
                      navigation.navigate('ReportDetailScreen', {
                        reportId: item.id,
                        reportName: item.name,
                      });
                    }}
                  />
                )}
              />
            </View>
          </View>
        )}
      </View>
      <Modal
        title={t('error')}
        subtitle={error}
        isOpen={!!error}
        onClose={() => setError('')}
      />
      {project && (
        <EditProjectModal
          project={project}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSubmit={request => {
            setShowEdit(false);
            updateProject(request);
          }}
        />
      )}
      <CreateReportModal
        isOpen={showCreateReport}
        onClose={() => setShowCreateReport(false)}
        forceProjectId={projectId}
        onSubmit={async request => {
          setShowCreateReport(false);

          const report = await createReport(request);

          getProject();

          if (report) {
            navigation.navigate('ReportDetailScreen', {
              reportId: report.id,
              reportName: report.name,
            });
          }
        }}
      />
      {loading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    paddingHorizontal: 16,
  },
  nav: {
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
  },
  backButton: {
    paddingRight: 18,
  },
  projectName: {
    fontSize: 20,
    lineHeight: 30,
  },
  editButton: {
    paddingLeft: 18,
    marginBottom: -8,
  },
  project: {
    paddingHorizontal: 16,
    flex: 1,
  },
  description: {
    marginTop: 10,
    lineHeight: 30,
  },
  reportsHeader: {
    height: 50,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: -4,
  },
  reportsTitle: {
    fontSize: 20,
  },
});

export default ProjectDetailScreen;
