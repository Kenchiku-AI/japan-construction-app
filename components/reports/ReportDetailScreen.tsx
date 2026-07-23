import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Camera } from 'react-native-vision-camera';
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
import { CommonActions, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { ReportFieldValues, ReportStatus } from '../../types';
import { useReport } from './useReport';
import { Button, Divider, Input, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bgColor1, buttonColor, errorColor1, fontColor1, fontColor2, micUsedKey } from '../../constants';
import {
  Camera as CameraIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Close,
  Image,
  Menu,
  Microphone,
  Unlock,
} from '../shared/Icons';
import { useSpeech } from '../../context/speech/SpeechContext';
import PermissionModal from './PermissionModal';
import { Loader } from '../shared/Loader';
import { Modal } from '../shared/Modal';
import { UnsavedChangesModal } from './UnsavedChangesModal';
import { ReportMenu } from './ReportMenu';
import { DeleteReportModal } from './DeleteReportModal';
import { useModal } from '../../context/modal/ModalContext';
import { usePhotos } from '../../context/photos/PhotosContext';
import { EditReportNameModal } from './EditReportNameModal';
import { useKeyboard } from '../../services/keyboard/useKeyboard';
import ConfirmStatusModal from './ConfirmStatusModal';
import { useAuth } from '../../context/auth/AuthContext';

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
  const {
    isSpeaking,
    isProcessing,
    startReportSpeech,
    stopSpeech,
    resetSpeech,
    firstLoad,
  } = useSpeech();
  const { fadeOpacity } = useModal();
  const { top } = useSafeAreaInsets();
  const { isKeyboardVisible, keyboardHeight } = useKeyboard();
  const {
    report,
    getReport,
    updateReport,
    deleteReport,
    loading: reportLoading,
    error,
    setError,
  } = useReport(reportId);
  const {
    photoCountsByReport,
    loading: photosLoading,
    error: uploadError,
    setError: setUploadError,
  } = usePhotos();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [fieldValues, setFieldValues] = useState<ReportFieldValues>();
  const [permissionStatus, setPermissionStatus] = useState('');
  const [isUnsavedChangesShown, setIsUnsavedChangesShown] = useState(false);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [isNameModalShown, setIsNameModalShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [enableMicPulse, setEnableMicPulse] = useState(false);
  const [isStatusModalShown, setIsStatusModalShown] = useState(false);
  const speakingFadeOpacity = useSharedValue(0);
  const updateButtonHeight = useSharedValue(0);
  const updateButtonOpacity = useSharedValue(0);
  const photoButtonWidth = useSharedValue(0.5);
  const photoButtonOpacity = useSharedValue(1);
  const isLoaded = fieldValues !== undefined;
  const micPulse = useSharedValue(1);
  const isReportEditable = !report?.disabled && report?.status !== ReportStatus.Closed;

  const speakingFadeStyle = useAnimatedStyle(() => ({
    opacity: speakingFadeOpacity.value,
  }));

  const updateButtonStyle = useAnimatedStyle(() => ({
    height: updateButtonHeight.value,
    opacity: updateButtonOpacity.value,
    overflow: 'hidden',
  }));

  const photoButtonStyle = useAnimatedStyle(() => ({
    width: `${photoButtonWidth.value * 100}%`,
    opacity: photoButtonOpacity.value,
  }));

  const micPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micPulse.value }],
    opacity: interpolate(
      micPulse.value,
      [1, 1.08],
      [1, 0.8],
      Extrapolate.CLAMP,
    ),
    zIndex: 300,
    flex: 1,
  }));

  useEffect(() => {
    getReport();

    (async () => {
      const usedMicCount = await AsyncStorage.getItem(micUsedKey);
      const countNumber = Number(usedMicCount ?? '0');
      setEnableMicPulse(countNumber < 3);
    })();

    const tabNav = navigation.getParent();
    if (!tabNav) return;

    const tabState = tabNav.getState();
    const activeTabKey = tabState.routes[tabState.index].key;

    tabState.routes.forEach(tabRoute => {
      if (tabRoute.key === activeTabKey) return;

      const stackState = tabRoute.state;
      if (!stackState?.routes) return;

      const reportIndex = stackState.routes.findIndex(
        route => route.name === 'ReportDetailScreen',
      );

      if (reportIndex === -1) return;

      const routesToKeep = stackState.routes.slice(0, reportIndex);
      if (!routesToKeep.length) return;

      navigation.dispatch({
        ...CommonActions.reset({
          index: routesToKeep.length - 1,
          routes: routesToKeep.map(r => ({
            name: r.name,
            params: r.params,
          })),
        }),
        target: stackState.key,
      });
    });
  }, []);

  useEffect(() => {
    if (!report) return;

    const newValues: ReportFieldValues = {};

    report?.fields.forEach(f => {
      newValues[f.id] = f.value;
    });

    setFieldValues(newValues);
  }, [report]);

  useEffect(() => {
    if (!enableMicPulse) {
      micPulse.value = withTiming(1, { duration: 200 });
      return;
    }

    if (!isSpeaking && !isProcessing && !firstLoad) {
      micPulse.value = withRepeat(
        withTiming(1.08, { duration: 600 }),
        -1,
        true,
      );
    } else {
      micPulse.value = withTiming(1, { duration: 200 });
    }
  }, [isSpeaking, isProcessing, firstLoad, enableMicPulse]);

  useEffect(() => {
    speakingFadeOpacity.value = withTiming(isSpeaking ? 0.5 : 0, {
      duration: 200,
    });
    fadeOpacity.value = withTiming(isSpeaking ? 1 : 0, {
      duration: 200,
    });
    photoButtonWidth.value = withTiming(isSpeaking ? 0 : 0.5, {
      duration: 200,
    });
    photoButtonOpacity.value = withTiming(isSpeaking ? 0 : 1, {
      duration: isSpeaking ? 100 : 400,
    });
  }, [isSpeaking]);

  const isUpdateDisabled = useMemo(() => {
    if (!fieldValues || !report || isSpeaking || isProcessing || reportLoading)
      return true;

    return !report.fields.some(f => f.value !== fieldValues[f.id]);
  }, [report, fieldValues, isSpeaking, reportLoading]);

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

    setEnableMicPulse(false);

    const usedMicCount = await AsyncStorage.getItem(micUsedKey);
    const countNumber = Number(usedMicCount ?? '0');
    AsyncStorage.setItem(micUsedKey, `${countNumber + 1}`);

    if (isSpeaking) {
      stopSpeech();
    } else {
      startReportSpeech(report.id, fieldValues => {
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
  }, [isSpeaking, stopSpeech, startReportSpeech, report]);

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
                  text={report?.name ?? reportName}
                  style={styles.reportName}
                  numberOfLines={1}
                />
              </View>
            </View>
            {isReportEditable && (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setIsMenuShown(true)}
              >
                <Menu size={30} />
              </TouchableOpacity>
            )}
          </View>
          <Divider />
        </View>
        {isLoaded && report ? (
          <>
            <View style={{ flex: 1 }}>
              <FlatList
                data={report.fields}
                keyExtractor={(item) => item.id}
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
                    disabled={!isReportEditable}
                  />
                )}
                ListHeaderComponent={() => {
                  const photoCount = photoCountsByReport[reportId];
                  if (photoCount < 1) return null;

                  return (
                    <>
                      {report.status === ReportStatus.Closed && (
                        <>
                          <View style={styles.statusRow}>
                            <View style={styles.statusLabel}>
                              <Close color={fontColor2} size={24} />
                              <Label text={t('report_closed')} size={14} light />
                            </View>
                            {(!report.disabled && currentUser?.role === "manager") && (
                              <Button
                                variant="tertiary"
                                label={t("close")}
                                iconLeft={() => <Unlock />}
                                onPress={() => setIsStatusModalShown(true)}
                                style={{ height: "auto" }}
                              />
                            )}
                          </View>
                          <Divider light />
                        </>
                      )}
                      <TouchableOpacity
                        style={styles.photos}
                        onPress={() => {
                          navigation.navigate('ReportPhotosScreen', {
                            reportId,
                            companyId: report.company_id,
                            disabled: !isReportEditable,
                          });
                        }}
                      >
                        <View style={styles.photosInfo}>
                          <Image color={fontColor1} size={26} />
                          <Label
                            text={t('photo_count', {
                              count: photoCount,
                            })}
                            style={styles.photosCount}
                          />
                        </View>
                        <View style={styles.viewAllPhotos}>
                          <Label text={t('view_all')} size={14} light />
                          <ChevronRight size={18} />
                        </View>
                      </TouchableOpacity>
                      <Divider light />
                    </>
                  );
                }}
                keyboardDismissMode="interactive"
                contentContainerStyle={{
                  ...styles.fields,
                  paddingBottom: isKeyboardVisible ? keyboardHeight - 180 : 10,
                }}
              />
              {isProcessing && <Loader />}
            </View>
            {isReportEditable && (
              <>
                <Divider style={styles.divider} light />
                <View style={styles.buttonsOuter}>
                  <View style={styles.buttonsInner}>
                    <Animated.View style={photoButtonStyle}>
                      <View style={styles.photoButtonContainer}>
                        <Button
                          style={styles.photoButton}
                          variant="secondary"
                          label={t('add_photo')}
                          iconLeft={() => (
                            <View style={{ marginRight: 8 }}>
                              <CameraIcon />
                            </View>
                          )}
                          onPress={async () => {
                            const status =
                              await Camera.requestCameraPermission();

                            if (status === 'granted') {
                              navigation
                                .getParent()
                                ?.navigate('CameraScreen', { reportId });
                            }
                          }}
                        />
                      </View>
                    </Animated.View>
                    <Animated.View style={micPulseStyle}>
                      <Button
                        variant={isUpdateDisabled ? 'primary' : 'secondary'}
                        style={{
                          ...styles.speakButton,
                          backgroundColor: isSpeaking ? errorColor1 : (isUpdateDisabled ? buttonColor : "white"),
                          marginLeft: isSpeaking ? 0 : 5,
                        }}
                        label={t(
                          isSpeaking
                            ? 'done'
                            : isProcessing
                              ? 'processing'
                              : 'start_speaking',
                        )}
                        iconLeft={() =>
                          isSpeaking || isProcessing ? undefined : (
                            <Microphone
                              color={isUpdateDisabled ? 'white' : buttonColor}
                            />
                          )
                        }
                        disabled={isProcessing || firstLoad}
                        onPress={onPressSpeech}
                      />
                    </Animated.View>
                  </View>
                  <Animated.View style={updateButtonStyle}>
                    <View style={styles.updateButtonContainer}>
                      <Button
                        label={t('save_changes')}
                        onPress={onPressUpdate}
                        disabled={isUpdateDisabled}
                        style={styles.updateButton}
                        iconLeft={() => <Check color="white" />}
                      />
                    </View>
                  </Animated.View>
                </View>
              </>
            )}
          </>
        ) : (
          <Loader fullScreen={false} />
        )}
        {isLoaded && (reportLoading || photosLoading) && <Loader />}
      </View>
      <Animated.View
        style={[styles.speakingFade, speakingFadeStyle]}
        pointerEvents={isSpeaking ? undefined : 'none'}
      />
      {isSpeaking && (
        <View style={styles.speechDescriptionContainer}>
          <Label text={t("speech_description")} size={15} style={styles.speechDescription} />
        </View>
      )}
      <PermissionModal
        isOpen={!!permissionStatus}
        onClose={() => setPermissionStatus('')}
        status={permissionStatus}
      />
      <UnsavedChangesModal
        isOpen={isUnsavedChangesShown}
        onClose={() => setIsUnsavedChangesShown(false)}
        onLeave={() => {
          setIsUnsavedChangesShown(false);
          setTimeout(() => {
            goBack();
          }, 201);
        }}
        onSave={async () => {
          setIsUnsavedChangesShown(false);
          await onPressUpdate();
          goBack();
        }}
      />
      <ReportMenu
        isOpen={isMenuShown}
        onClose={() => setIsMenuShown(false)}
        onChangeName={() => {
          setIsNameModalShown(true);
        }}
        onCloseReport={() => {
          setIsStatusModalShown(true);
        }}
        onDelete={() => {
          setIsDeleteModalShown(true);
        }}
      />
      <DeleteReportModal
        isOpen={isDeleteModalShown}
        onClose={() => setIsDeleteModalShown(false)}
        onDelete={() => {
          setIsDeleteModalShown(false);
          deleteReport();
        }}
      />
      {report && (
        <EditReportNameModal
          reportName={report.name}
          isOpen={isNameModalShown}
          onClose={() => setIsNameModalShown(false)}
          onSubmit={request => {
            updateReport(request);
            setIsNameModalShown(false);
          }}
        />
      )}
      <Modal
        title={t('error')}
        subtitle={error}
        isOpen={!!error}
        onClose={() => setError('')}
      />
      <Modal
        title={t('error')}
        subtitle={uploadError}
        isOpen={!!uploadError}
        onClose={() => setUploadError('')}
      />
      <ConfirmStatusModal
        currentStatus={report?.status ?? ReportStatus.Open}
        isOpen={isStatusModalShown}
        onClose={() => setIsStatusModalShown(false)}
        onConfirm={() => {
          setIsStatusModalShown(false);
          const status = report?.status === ReportStatus.Open ? ReportStatus.Closed : ReportStatus.Open;
          updateReport({ status });
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
    paddingHorizontal: 16,
    // flex: 1,
  },
  buttonsOuter: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: bgColor1,
  },
  buttonsInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButtonContainer: {
    flex: 1,
    paddingRight: 5,
  },
  photoButton: {
    flex: 1,
  },
  speakButton: {
    // zIndex: 300,
    // flex: 1,
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
  photos: {
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  photosInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  photosCount: {
    flexShrink: 1,
  },
  viewAllPhotos: {
    flexDirection: "row",
    marginHorizontal: 12,
    alignItems: "center",
    gap: 8
  },
  divider: {
    marginHorizontal: 16,
  },
  statusRow: {
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 16
  },
  statusLabel: {
    flexDirection: "row",
    alignItems: 'center',
    gap: 2
  },
  speechDescriptionContainer: {
    position: 'absolute',
    right: 16,
    left: 16,
    bottom: 90,
    zIndex: 300,
    backgroundColor: "#00000080",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 5,
  },
  speechDescription: {
    color: "white",
    textAlign: "center",
    lineHeight: 20
  }
});

export default ReportDetailScreen;
