import { FC, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Loader } from '../shared/Loader';
import { Divider, Label, Modal } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Edit } from '../shared/Icons';
import { buttonColor } from '../../constants';
import { RouteProp } from '@react-navigation/native';
import { useProject } from './useProject';
import { CreateReportModal } from '../reports/CreateReportModal';
import { useReports } from '../reports/useReports';
import { useTranslation } from 'react-i18next';

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
  const { project, error, setError } = useProject(projectId);
  const { createReport } = useReports();
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

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
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowEdit(true)}
            >
              <Edit size={30} />
            </TouchableOpacity>
          </View>
          <Divider />
        </View>
        {/* {isLoaded && project ? (
          <>
            <FlatList
              data={project.reports}
              renderItem={({ item }) => (
 
              )}
              ListHeaderComponent={() => {
                if (report.photo_count < 1) return null;

                return (
                  <>
                    <TouchableOpacity
                      style={styles.photos}
                      onPress={() => {
                        navigation.navigate('ReportPhotosScreen', {
                          reportId,
                          companyId: report.company_id,
                        });
                      }}
                    >
                      <View style={styles.photosInfo}>
                        <Image color={fontColor1} size={26} />
                        <Label
                          text={t('photo_count', { count: report.photo_count })}
                          style={styles.photosCount}
                        />
                      </View>
                      <View style={styles.chevron}>
                        <ChevronRight />
                      </View>
                    </TouchableOpacity>
                    <Divider light />
                  </>
                );
              }}
              contentContainerStyle={styles.fields}
            />
            <Divider style={styles.divider} light />
          </>
        ) : (
          <Loader fullScreen={false} />
        )} */}
      </View>
      <Modal
        title={t('error')}
        subtitle={error}
        isOpen={!!error}
        onClose={() => setError('')}
      />
      <CreateReportModal
        isOpen={showCreateReport}
        onClose={() => setShowCreateReport(false)}
        forceProjectId={projectId}
        onSubmit={async request => {
          setShowCreateReport(false);

          const report = await createReport(request);

          if (report) {
            navigation.navigate('ReportDetailScreen', {
              reportId: report.id,
              reportName: report.name,
            });
          }
        }}
      />
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
  },
});

export default ProjectDetailScreen;
