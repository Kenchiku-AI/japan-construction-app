import { FC } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackNavigationParams } from '../../navigation/ProjectsStack';
import { View } from 'react-native';

interface ProjectDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ProjectsStackNavigationParams,
    'ProjectDetailScreen'
  >;
}

const DailyReportDetailScreen: FC<ProjectDetailScreenProps> = () => {
  return <View></View>;
};

export default DailyReportDetailScreen;
