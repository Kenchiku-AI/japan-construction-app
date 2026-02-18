import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { ChevronRight, Plus, Reports } from '../shared/Icons';
import { Label } from '../shared';
import { useTranslation } from 'react-i18next';
import { Button, Divider } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontColor2 } from '../../constants';
import { Report } from '../../types';

interface ReportsListScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportsListScreen'
  >;
}

const ReportsListScreen: FC<ReportsListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top, ...styles.container }}>
      <View style={styles.nav}>
        <Label text={t('reports')} size={24} />
        <Button
          variant="tertiary"
          label={t('create_report')}
          onPress={() => {
            navigation.navigate('CreateReportScreen');
          }}
          iconLeft={() => <Plus />}
        />
      </View>
      <Divider />
      <FlatList
        style={{ flex: 1 }}
        data={[]}
        renderItem={({ item, index }) => (
          <ReportsListItem
            report={item}
            onPress={() => {}}
            showDivider={index !== 0}
          />
        )}
      />
    </View>
  );
};

interface ReportsListItemProps {
  report: Report;
  onPress: () => void;
  showDivider?: boolean;
}

const ReportsListItem: FC<ReportsListItemProps> = ({
  report,
  onPress,
  showDivider,
}) => {
  return (
    <>
      {showDivider && <Divider style={styles.reportDivider} />}
      <TouchableOpacity style={styles.report} onPress={onPress}>
        <View style={styles.reportInfo}>
          <Reports size={30} />
          <Label text={report.name} />
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
  heading: {
    paddingHorizontal: 20,
  },
  createButton: {
    flex: 1,
  },
  headingDivider: {
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
  report: {
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportDivider: {
    backgroundColor: fontColor2,
  },
});

export default ReportsListScreen;
