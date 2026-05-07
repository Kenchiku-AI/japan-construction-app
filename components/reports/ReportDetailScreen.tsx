import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
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
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ReportFieldValues } from '../../types';
import { useReport } from './useReport';
import { Button, Divider, Input, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bgColor1, buttonColor, fontColor1 } from '../../constants';
import {
  Camera as CameraIcon,
  ChevronLeft,
  ChevronRight,
  Image,
  Menu,
  Microphone,
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
  } = useSpeech();
  const { fadeOpacity } = useModal();
  const { top } = useSafeAreaInsets();
  const {
    report,
    getReport,
    updateReport,
    deleteReport,
    uploadImage,
    loading,
    error,
    setError,
  } = useReport(reportId);

  const { setOnPhotoAdded } = usePhotos();
  const { t } = useTranslation();
  const [fieldValues, setFieldValues] = useState<ReportFieldValues>();
  const [permissionStatus, setPermissionStatus] = useState('');
  const [isUnsavedChangesShown, setIsUnsavedChangesShown] = useState(false);
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const speakingFadeOpacity = useSharedValue(0);
  const updateButtonHeight = useSharedValue(0);
  const updateButtonOpacity = useSharedValue(0);
  const photoButtonWidth = useSharedValue(0.5);
  const photoButtonOpacity = useSharedValue(1);
  const isLoaded = fieldValues !== undefined;

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

  useFocusEffect(
    useCallback(() => {
      setOnPhotoAdded(() => async (uri: string) => {
        await uploadImage(uri);
        getReport();
      });

      getReport();
    }, []),
  );

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
    if (!fieldValues || !report || isSpeaking || isProcessing || loading)
      return true;

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
        {isLoaded && report ? (
          <>
            <FlatList
              data={report.fields}
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
                        const status = await Camera.requestCameraPermission();

                        if (status === 'granted') {
                          navigation
                            .getParent()
                            ?.navigate('CameraScreen', { reportId });
                        }
                      }}
                    />
                  </View>
                </Animated.View>
                <Button
                  style={{
                    ...styles.speakButton,
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
                    isSpeaking || isProcessing ? undefined : <Microphone />
                  }
                  disabled={isProcessing}
                  onPress={onPressSpeech}
                />
              </View>
              <Animated.View style={updateButtonStyle}>
                <View style={styles.updateButtonContainer}>
                  <Button
                    variant="secondary"
                    label={t('save_changes')}
                    onPress={onPressUpdate}
                    disabled={isUpdateDisabled}
                    style={styles.updateButton}
                  />
                </View>
              </Animated.View>
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
          setIsUnsavedChangesShown(false);
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
        onDelete={() => {
          setIsDeleteModalShown(false);
          deleteReport();
        }}
      />
      <Modal
        title={t('error')}
        subtitle={error}
        isOpen={!!error}
        onClose={() => setError('')}
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
    paddingBottom: 10,
    paddingHorizontal: 16,
    flex: 1,
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
    zIndex: 300,
    flex: 1,
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
    height: 70,
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
  chevron: {
    marginHorizontal: 12,
  },
  divider: {
    marginHorizontal: 16,
  },
});

export default ReportDetailScreen;
