import { FC, useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { ChevronRight, Plus, Reports } from '../shared/Icons';
import { Label, Modal } from '../shared';
import { useTranslation } from 'react-i18next';
import { Button, Divider } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fontColor2 } from '../../constants';
import { ProjectStatus, Report } from '../../types';
import { CreateReportModal } from './CreateReportModal';
import { useReports } from './useReports';
import { Loader } from '../shared/Loader';
import { useAuth } from '../../context/auth/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { useDate } from '../../services/localization/useDate';

interface ReportsListScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportsListScreen'
  >;
}

const ReportsListScreen: FC<ReportsListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const { reports, getReports, createReport, loading, error, setError } =
    useReports();
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getReports();
    }, []),
  );

  const enableCreate = useMemo(() => {
    return currentUser?.projects.some(p => p.status === ProjectStatus.Active);
  }, [currentUser?.projects]);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.container }}>
        <View style={styles.nav}>
          <Label text={t('reports')} size={24} numberOfLines={1} />
          {enableCreate && (
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
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await getReports();
              setRefreshing(false);
            }}
          />
        </View>
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
      {loading && !refreshing && <Loader />}
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
  const { formatDate } = useDate();
  const { t } = useTranslation();

  const subtitle = useMemo(() => {
    const parts = [];

    if (report.project_name) {
      parts.push(report.project_name);
    }

    const date = formatDate(report.created_at);
    parts.push(t('created', { date }));

    return parts.join(' • ');
  }, [report.project_name, report.created_at]);

  return (
    <>
      <TouchableOpacity style={styles.report} onPress={onPress}>
        <View style={styles.reportInfo}>
          <Reports size={26} />
          <View style={styles.labels}>
            <Label
              text={report.name}
              style={styles.reportName}
              numberOfLines={1}
            />
            <Label
              text={subtitle}
              style={styles.subtitle}
              numberOfLines={1}
              light
            />
          </View>
        </View>
        <View style={styles.chevron}>
          <ChevronRight size={18} />
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
    paddingLeft: 8,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  labels: {
    gap: 2,
  },
  reportName: {
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 12,
  },
  reportDivider: {
    backgroundColor: fontColor2,
  },
  chevron: {
    marginHorizontal: 12,
  },
});

export default ReportsListScreen;
