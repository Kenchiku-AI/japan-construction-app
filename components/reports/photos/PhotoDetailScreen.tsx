import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Input, Label } from '../../shared';
import {
  Keyboard,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { CachedImage } from '../../shared/CachedImage';
import { ChevronLeft, Microphone, Tag, Trash } from '../../shared/Icons';
import {
  bgColor1,
  buttonColor,
  errorColor1,
  fontColor2,
} from '../../../constants';
import { useDate } from '../../../services/localization/useDate';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { ReportsStackNavigationParams } from '../../../navigation/ReportsStack';
import { RouteProp } from '@react-navigation/native';
import { ConfirmDeletePhotoModal } from './ConfirmDeletePhotoModal';
import { useReportPhoto } from './useReportPhoto';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useModal } from '../../../context/modal/ModalContext';
import { useSpeech } from '../../../context/speech/SpeechContext';
import PermissionModal from '../PermissionModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Loader } from '../../shared/Loader';

interface PhotoDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'PhotoDetailScreen'
  >;
  route: RouteProp<ReportsStackNavigationParams, 'PhotoDetailScreen'>;
}

export const PhotoDetailScreen: FC<PhotoDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { image: initialImage } = route.params;
  const { image, deleteImage, updateImage, loading } =
    useReportPhoto(initialImage);
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const { formatDate } = useDate();
  const [isConfirmDeleteShown, setIsConfirmDeleteShown] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('');
  const [description, setDescription] = useState(initialImage.description);
  const {
    isSpeaking,
    isProcessing,
    startPhotoSpeech,
    stopSpeech,
    resetSpeech,
  } = useSpeech();
  const { fadeOpacity } = useModal();
  const speakingFadeOpacity = useSharedValue(0);
  const updateButtonHeight = useSharedValue(0);
  const updateButtonOpacity = useSharedValue(0);
  const photoButtonWidth = useSharedValue(0.5);
  const photoButtonOpacity = useSharedValue(1);

  const speakingFadeStyle = useAnimatedStyle(() => ({
    opacity: speakingFadeOpacity.value,
  }));

  const updateButtonStyle = useAnimatedStyle(() => ({
    height: updateButtonHeight.value,
    opacity: updateButtonOpacity.value,
    overflow: 'hidden',
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    width: `${photoButtonWidth.value * 100}%`,
    opacity: photoButtonOpacity.value,
  }));

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

  const date = useMemo(() => {
    if (!image?.created_at) return null;
    return formatDate(image.created_at);
  }, [image?.created_at]);

  const isUpdateDisabled = useMemo(() => {
    if (isSpeaking || isProcessing || loading) return true;

    return description === image.description;
  }, [description, image, isSpeaking, loading]);

  const onPressUpdate = useCallback(async () => {
    if (!description) return;
    await updateImage(description);
  }, [description, updateImage]);

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

  const onPressSpeech = useCallback(async () => {
    Keyboard.dismiss();

    if (!image) return;

    const hasPermission = await checkMicPermission();
    if (!hasPermission) {
      return;
    }

    if (isSpeaking) {
      stopSpeech();
    } else {
      startPhotoSpeech(text => {
        setDescription(text);
      });
    }
  }, [isSpeaking, stopSpeech, startPhotoSpeech, image]);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.navContainer }}>
        <View style={styles.nav}>
          <View style={styles.navLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                resetSpeech();
                navigation.goBack();
              }}
            >
              <ChevronLeft color={buttonColor} size={20} />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Label
                text={t('photo_details')}
                style={styles.title}
                numberOfLines={1}
              />
            </View>
          </View>
        </View>
        <Divider />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.image}>
          {image && <CachedImage image={image} width={width - 32} />}
        </View>
        {date && <Text style={styles.date}>{t('photo_taken', { date })}</Text>}
        <Input
          placeholder={t('description')}
          value={description}
          onChange={d => setDescription(d)}
          style={{ height: 120 }}
          multiline
        />
        <View style={styles.tags}></View>
      </ScrollView>
      <View style={styles.buttonsOuter}>
        <View style={styles.buttonsInner}>
          <Animated.View style={deleteButtonStyle}>
            <View style={styles.deleteButtonContainer}>
              <Button
                style={styles.deleteButton}
                textStyle={styles.deleteButtonText}
                variant="secondary"
                label={t('delete')}
                iconLeft={() => <Trash color={errorColor1} />}
                onPress={() => setIsConfirmDeleteShown(true)}
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
              label={t('update_photo')}
              onPress={onPressUpdate}
              disabled={isUpdateDisabled}
              style={styles.updateButton}
            />
          </View>
        </Animated.View>
      </View>
      <Animated.View
        style={[styles.speakingFade, speakingFadeStyle]}
        pointerEvents={isSpeaking ? undefined : 'none'}
      />
      <ConfirmDeletePhotoModal
        isOpen={isConfirmDeleteShown}
        onClose={() => setIsConfirmDeleteShown(false)}
        onDelete={async () => {
          setIsConfirmDeleteShown(false);
          await deleteImage();
          resetSpeech();
          navigation.navigate('ReportPhotosScreen', {
            reportId: image.report_id,
            deletedImageId: image.id,
          });
        }}
      />
      <PermissionModal
        isOpen={!!permissionStatus}
        onClose={() => setPermissionStatus('')}
        status={permissionStatus}
      />
      {loading && <Loader />}
    </>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    lineHeight: 30,
  },
  container: {
    padding: 16,
  },
  tags: {
    flexDirection: 'row',
    gap: 10,
  },
  date: {
    marginTop: 10,
    color: fontColor2,
  },
  buttons: {
    gap: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    marginLeft: -5,
    marginRight: 5,
  },
  confirmDeleteButtons: {
    gap: 10,
    marginTop: 20,
  },
  tagButton: {
    width: '50%',
  },
  image: {
    alignItems: 'center',
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
  deleteButtonContainer: {
    flex: 1,
    paddingRight: 5,
  },
  deleteButton: {
    flex: 1,
    borderColor: errorColor1,
  },
  deleteButtonText: {
    color: errorColor1,
  },
  speakButton: {
    backgroundColor: errorColor1,
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
});
