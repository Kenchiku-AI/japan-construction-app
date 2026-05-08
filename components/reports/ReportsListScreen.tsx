import { FC, useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { ChevronRight, Plus, Reports } from '../shared/Icons';
import { Label, Modal } from '../shared';
import { useTranslation } from 'react-i18next';
import { Button, Divider } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontColor2 } from '../../constants';
import { Report } from '../../types';
import { CreateReportModal } from './CreateReportModal';
import { useReports } from './useReports';
import { Loader } from '../shared/Loader';
import { useFocusEffect } from '@react-navigation/native';

interface ReportsListScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportsListScreen'
  >;
}

const ReportsListScreen: FC<ReportsListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { reports, getReports, createReport, loading, error, setError } =
    useReports();
  const [showCreateReport, setShowCreateReport] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getReports();
    }, []),
  );

  return (
    <>
      <View style={{ paddingTop: top, ...styles.container }}>
        <View style={styles.nav}>
          <Label text={t('reports')} size={24} numberOfLines={1} />
          <Button
            variant="tertiary"
            label={t('create_report')}
            onPress={() => {
              setShowCreateReport(true);
            }}
            iconRight={() => <Plus size={30} />}
          />
        </View>
        <Divider />
        <FlatList
          style={styles.reports}
          data={reports}
          renderItem={({ item }) => (
            <ReportsListItem
              key={item.id}
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
      <CreateReportModal
        isOpen={showCreateReport}
        onClose={() => setShowCreateReport(false)}
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
      <Modal
        title={t('error')}
        subtitle={error}
        isOpen={!!error}
        onClose={() => setError('')}
      />
      {loading && <Loader />}
    </>
  );
};

interface ReportsListItemProps {
  report: Report;
  onPress: () => void;
}

export const ReportsListItem: FC<ReportsListItemProps> = ({
  report,
  onPress,
}) => {
  return (
    <>
      <TouchableOpacity style={styles.report} onPress={onPress}>
        <View style={styles.reportInfo}>
          <View style={styles.icon}>
            <Reports size={26} />
          </View>
          <Label
            text={report.name}
            style={styles.reportName}
            numberOfLines={1}
          />
        </View>
        <View style={styles.chevron}>
          <ChevronRight />
        </View>
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
    marginRight: -4,
  },
  heading: {
    paddingHorizontal: 16,
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
  icon: {
    marginLeft: -2,
  },
  reports: {
    flex: 1,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  report: {
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
  },
  reportName: {
    flexShrink: 1,
  },
  reportDivider: {
    backgroundColor: fontColor2,
  },
  chevron: {
    marginHorizontal: 12,
  },
});

export default ReportsListScreen;
