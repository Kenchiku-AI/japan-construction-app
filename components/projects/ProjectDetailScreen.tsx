import { FC } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Loader } from '../shared/Loader';
import { Divider, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from '../shared/Icons';
import { buttonColor } from '../../constants';

interface ProjectDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectDetailScreen'
  >;
}

const ProjectDetailScreen: FC<ProjectDetailScreenProps> = ({
  navigation
}) => {
  const { top } = useSafeAreaInsets();
  
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
                  text={reportName}
                  style={styles.projectName}
                  numberOfLines={1}
                />
              </View>
            </View>
          </View>
          <Divider />
        </View>
        {isLoaded && project ? (
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
        )}
      </View>
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
});

export default ProjectDetailScreen;
