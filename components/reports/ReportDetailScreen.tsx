import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ReportFieldValues } from '../../types';
import { useReport } from './useReport';
import { Button, Divider, Input, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bgColor1, buttonColor, errorColor1 } from '../../constants';
import { ChevronLeft, Menu, Microphone } from '../shared/Icons';
import { useSpeech } from '../../context/speech/SpeechContext';
import PermissionModal from './PermissionModal';
import { Loader } from '../shared/Loader';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { ReportMenu } from './ReportMenu';
import { DeleteReportModal } from './DeleteReportModal';

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
  const { isSpeaking, isProcessing, startSpeech, stopSpeech, resetSpeech } =
    useSpeech();
  const { top } = useSafeAreaInsets();
  const { report, updateReport, loading } = useReport(reportId);
  const { t } = useTranslation();
  const [fieldValues, setFieldValues] = useState<ReportFieldValues>();
  const [permissionStatus, setPermissionStatus] = useState('');
  const [isUnsavedChangesShown, setIsUnsavedChangesShown] = useState(false);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const speakingFadeOpacity = useSharedValue(0);
  const updateButtonHeight = useSharedValue(0);
  const updateButtonOpacity = useSharedValue(0);
  const isLoaded = fieldValues !== undefined;

  const speakingFadeStyle = useAnimatedStyle(() => ({
    opacity: speakingFadeOpacity.value,
  }));

  const updateButtonStyle = useAnimatedStyle(() => ({
    height: updateButtonHeight.value,
    opacity: updateButtonOpacity.value,
    overflow: 'hidden',
  }));

  useEffect(() => {
    if (!report) return;

    const newValues: ReportFieldValues = {};

    report?.fields.forEach(f => {
      newValues[f.id] = f.value;
    });

    setFieldValues(newValues);
  }, [report]);

  useEffect(() => {
    speakingFadeOpacity.value = withTiming(isSpeaking ? 0.5 : 0, {
      duration: 200,
    });
  }, [isSpeaking]);

  const isUpdateDisabled = useMemo(() => {
    if (!fieldValues || !report || isSpeaking || loading) return true;

    return !report.fields.some(f => f.value !== fieldValues[f.id]);
  }, [report, fieldValues, isSpeaking, loading]);

  useEffect(() => {
    updateButtonHeight.value = withTiming(isUpdateDisabled ? 0 : 70, {
      duration: 200,
    });
    updateButtonOpacity.value = withTiming(isUpdateDisabled ? 0 : 1, {
      duration: 200,
    });
  }, [isUpdateDisabled]);

  const onPressUpdate = useCallback(async () => {
    await updateReport({ field_values: fieldValues });
  }, [fieldValues, updateReport]);

  const onPressSpeech = useCallback(async () => {
    Keyboard.dismiss();

    if (!report) return;

    const hasPermission = await checkMicPermission();
    if (!hasPermission) {
      return;
    }

    if (isSpeaking) {
      stopSpeech();
    } else {
      startSpeech(report.id, fieldValues => {
        setFieldValues(prev => {
          const newValues = { ...prev };

          Object.entries(fieldValues).forEach(([key, value]) => {
            if (report.fields?.some(f => f.id === key)) {
              newValues[key] = value;
            }
          });

          return newValues;
        });
      });
    }
  }, [isSpeaking, stopSpeech, startSpeech, report]);

  const goBack = () => {
    resetSpeech();
    navigation.goBack();
  };

  const checkMicPermission = async () => {
    if (Platform.OS === 'android') {
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      if (!isGranted) {
        setPermissionStatus('denied');
      }

      return isGranted;
    }

    if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.MICROPHONE);
      const isGranted = status === RESULTS.GRANTED;

      if (!isGranted) {
        setPermissionStatus(status);
      }

      return isGranted;
    }

    return false;
  };

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
                onPress={() => {
                  if (!isUpdateDisabled) {
                    setIsUnsavedChangesShown(true);
                  } else {
                    goBack();
                  }
                }}
              >
                <ChevronLeft color={buttonColor} size={20} />
              </TouchableOpacity>
              <View style={{ flexShrink: 1 }}>
                <Label
                  text={reportName}
                  style={styles.reportName}
                  numberOfLines={1}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setIsMenuShown(true)}
            >
              <Menu size={30} />
            </TouchableOpacity>
          </View>
          <Divider />
        </View>
        {isLoaded ? (
          <>
            <FlatList
              data={report?.fields ?? []}
              renderItem={({ item }) => (
                <Input
                  key={item.id}
                  placeholder={item.name}
                  value={fieldValues?.[item.id]}
                  onChange={value => {
                    setFieldValues(prev => {
                      const newValues = { ...prev };
                      newValues[item.id] = value;
                      return newValues;
                    });
                  }}
                />
              )}
              contentContainerStyle={styles.fields}
            />
            <View style={styles.buttons}>
              <Animated.View style={updateButtonStyle}>
                <View style={styles.updateButtonContainer}>
                  <Button
                    label={t('update_report')}
                    onPress={onPressUpdate}
                    disabled={isUpdateDisabled}
                    style={styles.updateButton}
                  />
                </View>
              </Animated.View>
              <View style={styles.speakButtonConatiner}>
                <Button
                  style={styles.speakButton}
                  label={t(
                    isSpeaking
                      ? 'done'
                      : isProcessing
                      ? 'processing'
                      : 'start_speaking',
                  )}
                  iconLeft={() =>
                    isSpeaking || isProcessing ? undefined : <Microphone />
                  }
                  disabled={isProcessing}
                  onPress={onPressSpeech}
                />
              </View>
            </View>
          </>
        ) : (
          <Loader fullScreen={false} />
        )}
        {isLoaded && loading && <Loader />}
      </View>
      <Animated.View
        style={[styles.speakingFade, speakingFadeStyle]}
        pointerEvents={isSpeaking ? undefined : 'none'}
      />
      <PermissionModal
        isOpen={!!permissionStatus}
        onClose={() => setPermissionStatus('')}
        status={permissionStatus}
      />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesShown}
        onClose={() => setIsUnsavedChangesShown(false)}
        onLeave={goBack}
        onSave={async () => {
          await onPressUpdate();
          goBack();
        }}
      />
      <ReportMenu
        isOpen={isMenuShown}
        onClose={() => setIsMenuShown(false)}
        onChangeName={() => {}}
        onDelete={() => {
          setIsDeleteModalShown(true);
        }}
      />
      <DeleteReportModal
        isOpen={isDeleteModalShown}
        onClose={() => setIsDeleteModalShown(false)}
        onDelete={() => {}}
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
  reportName: {
    fontSize: 20,
    lineHeight: 30,
  },
  menuButton: {
    paddingLeft: 18,
  },
  fieldsContainer: {
    flex: 1,
  },
  fields: {
    gap: 10,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  buttons: {
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: bgColor1,
  },
  speakButtonConatiner: {
    paddingTop: 10,
  },
  speakButton: {
    backgroundColor: errorColor1,
    zIndex: 300,
  },
  updateButtonContainer: {
    paddingTop: 10,
  },
  updateButton: {
    opacity: 1,
    height: '100%',
  },
  speakingFade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: 200,
  },
});

export default ReportDetailScreen;
