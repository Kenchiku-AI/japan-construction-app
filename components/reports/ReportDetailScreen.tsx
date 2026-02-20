import { FC, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useTranslation } from 'react-i18next';
import { ReportFieldValues } from '../../types';
import { useReport } from './useReport';
import { Button, Divider, Input, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { buttonColor, errorColor1 } from '../../constants';
import { ChevronLeft, Microphone } from '../shared/Icons';

interface ReportDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportDetailScreen'
  >;
  route: RouteProp<ReportsStackNavigationParams, 'ReportDetailScreen'>;
}

const ReportDetailScreen: FC<ReportDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { reportId, reportName } = route.params;
  const { currentUser } = useAuthContext();
  const { top } = useSafeAreaInsets();
  const { report, updateReport, loading } = useReport(reportId);
  const { t } = useTranslation();
  const [fieldValues, setFieldValues] = useState<ReportFieldValues>();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(reportName);
  const [displayName, setDisplayName] = useState(reportName);

  useEffect(() => {
    const newValues: ReportFieldValues = {};

    report?.fields.forEach(f => {
      newValues[f.id] = f.value;
    });

    setFieldValues(newValues);
  }, [report]);

  const isDisabled = useMemo(() => {
    if (!fieldValues || !report) return true;

    const missingField = report.fields.some(f => !fieldValues[f.id]);
    if (missingField) return true;

    const isChanged = report.fields.some(f => f.value !== fieldValues[f.id]);
    return !isChanged;
  }, [report, fieldValues]);

  return (
    <View style={{ ...styles.container, paddingTop: top }}>
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color={buttonColor} size={18} />
        </TouchableOpacity>
        {isEditingName ? (
          <Input placeholder={t('report_name')} value={editedName} />
        ) : (
          <Label text={displayName} size={24} />
        )}
      </View>
      <Divider />
      <FlatList
        data={report?.fields ?? []}
        renderItem={({ item }) => {
          return (
            <Input
              key={item.id}
              placeholder={item.name}
              defaultValue={item.value}
              onChange={value => {
                setFieldValues(prev => {
                  const newValues = { ...prev };
                  newValues[item.id] = value;
                  return newValues;
                });
              }}
            />
          );
        }}
        contentContainerStyle={styles.fields}
      />
      <View style={styles.buttons}>
        <Button
          style={styles.speakButton}
          label={t('speak_to_edit')}
          iconLeft={() => <Microphone />}
          onPress={() => {}}
        />
        <Button
          label={t('update_report')}
          disabled={isDisabled}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  nav: {
    height: 70,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    width: 32,
  },
  fields: {
    gap: 10,
    marginVertical: 20,
  },
  buttons: {
    marginVertical: 16,
    gap: 10,
  },
  speakButton: {
    borderRadius: 30,
    backgroundColor: errorColor1,
    gap: 10,
  },
});

export default ReportDetailScreen;
