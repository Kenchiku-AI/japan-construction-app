import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Input, Label } from '../../shared';
import {
  Keyboard,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { CachedImage } from '../../shared/CachedImage';
import {
  Check,
  Close,
  Microphone,
  Pinch,
  Plus,
  Trash,
  Zoom,
} from '../../shared/Icons';
import {
  bgColor1,
  bgColor2,
  buttonColor,
  errorColor1,
  fontColor2,
} from '../../../constants';
import { useDate } from '../../../services/localization/useDate';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { RouteProp } from '@react-navigation/native';
import { ConfirmDeletePhotoModal } from './ConfirmDeletePhotoModal';
import { ConfirmDeleteTagModal } from './ConfirmDeleteTagModal';
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
import { RootNavigationParams } from '../../../navigation/navigate';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { usePhotos } from '../../../context/photos/PhotosContext';
import AudioVisualizer from '../../shared/AudioVisualizer';
import { AddTagModal } from './AddTagModal';
import { useTags } from './useTags';
import { ReportImageTag } from '../../../types';

interface PhotoDetailScreenProps {
  navigation: NativeStackNavigationProp<
    RootNavigationParams,
    'PhotoDetailScreen'
  >;
  route: RouteProp<RootNavigationParams, 'PhotoDetailScreen'>;
}

export const PhotoDetailScreen: FC<PhotoDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { image: initialImage, companyId } = route.params;
  const { tags: allTags, loading: tagsLoading } = useTags(companyId);
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const { formatDate } = useDate();
  const [isConfirmDeleteShown, setIsConfirmDeleteShown] = useState(false);
  const [deleteTag, setDeleteTag] = useState<ReportImageTag>();
  const [isAddTagModalShown, setIsAddTagModalShown] = useState(false);
  const [isZoomShown, setIsZoomShown] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('');
  const [description, setDescription] = useState(initialImage.description);
  const descriptionRef = useRef(initialImage.description);
  const {
    isSpeaking,
    isProcessing,
    startPhotoSpeech,
    stopSpeech,
    resetSpeech,
  } = useSpeech();
  const { fadeOpacity } = useModal();
  const { onPhotoDeleted } = usePhotos();
  const speakingFadeOpacity = useSharedValue(0);
  const bottomButtonsHeight = useSharedValue(0);
  const updateButtonOpacity = useSharedValue(0);
  const photoButtonWidth = useSharedValue(0.5);
  const photoButtonOpacity = useSharedValue(1);
  const zoomOpacity = useSharedValue(0);
  const {
    image,
    deleteImage,
    updateImage,
    addTag,
    removeTag,
    loading: photoLoading,
  } = useReportPhoto(initialImage, (newDescription: string) => {
    setDescription(prev => {
      return `${prev ? `${prev} ` : ''}${newDescription}`;
    });
  });
  const loading = photoLoading || tagsLoading;

  const speakingFadeStyle = useAnimatedStyle(() => ({
    opacity: speakingFadeOpacity.value,
  }));

  const bottomButtonsStyle = useAnimatedStyle(() => ({
    height: bottomButtonsHeight.value,
    overflow: 'hidden',
  }));

  const updateButtonStyle = useAnimatedStyle(() => ({
    opacity: updateButtonOpacity.value,
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    width: `${photoButtonWidth.value * 100}%`,
    opacity: photoButtonOpacity.value,
  }));

  const zoomStyle = useAnimatedStyle(() => ({
    opacity: zoomOpacity.value,
  }));

  const date = useMemo(() => {
    if (!image?.created_at) return null;
    return formatDate(image.created_at);
  }, [image?.created_at]);

  const isProcessingShown = useMemo(() => {
    const statuses = ['pending', 'processing'];

    if (!statuses.includes(image.status)) return false;

    const createdAt = new Date(image.created_at).getMilliseconds();
    const now = new Date().getMilliseconds();
    const fiveMinutes = 5 * 60 * 1000;
    return now - createdAt < fiveMinutes;
  }, [image]);

  const isUpdateDisabled = useMemo(() => {
    if (isSpeaking || isProcessing || loading) return true;

    return description === image.description;
  }, [description, image, isSpeaking, isProcessing, loading]);

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

  useEffect(() => {
    const hasHeight = !isUpdateDisabled || isSpeaking || isProcessing;

    bottomButtonsHeight.value = withTiming(hasHeight ? 70 : 0, {
      duration: 200,
    });
    updateButtonOpacity.value = withTiming(
      !isUpdateDisabled || isProcessing ? 1 : 0,
      {
        duration: 200,
      },
    );
  }, [isUpdateDisabled, isSpeaking]);

  useEffect(() => {
    zoomOpacity.value = withTiming(isZoomShown ? 1 : 0, {
      duration: 200,
    });
  }, [isZoomShown]);

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
      descriptionRef.current = description;

      startPhotoSpeech(text => {
        setDescription(`${descriptionRef.current} ${text}`.trim());
      });
    }
  }, [isSpeaking, stopSpeech, startPhotoSpeech, description, image]);

  const availableTags = useMemo(() => {
    return allTags.filter(at => !image.tags.some(t => t.tag_id === at.id));
  }, [image.tags, allTags]);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.navContainer }}>
        <View style={styles.nav}>
          <View style={styles.navLeft}>
            <View style={styles.header}>
              <Label
                text={t('photo_details')}
                style={styles.title}
                numberOfLines={1}
              />
              {isProcessingShown && (
                <Label
                  style={styles.title}
                  text={`(${t('processing')})`}
                  light
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              resetSpeech();
            }}
          >
            <Close />
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {image && (
          <TouchableOpacity
            onPress={() => {
              setIsZoomShown(true);
            }}
          >
            <CachedImage image={image} width={width - 32} maxHeight={320} />
            <View style={styles.zoomDescription}>
              <Zoom size={16} />
              <Label
                style={styles.zoomDescriptionText}
                text={t('tap_to_zoom')}
              />
            </View>
          </TouchableOpacity>
        )}
        {date && (
          <Label style={styles.date} text={t('photo_taken', { date })} />
        )}
        <View style={styles.descriptionContainer}>
          <Input
            placeholder={t('description')}
            value={description}
            onChange={d => setDescription(d)}
            onClear={() => setDescription('')}
            style={styles.description}
            multiline
          />
        </View>
        {allTags.length > 0 && (
          <>
            <Label style={styles.tagsTitle} text={t('tags')} />
            <Divider light />
            {image.tags.length > 0 && (
              <View style={styles.tags}>
                {image.tags.map(t => (
                  <View key={t.tag_id} style={styles.tag}>
                    <Label text={t.name} />
                    <TouchableOpacity
                      onPress={() => {
                        setDeleteTag(t);
                      }}
                    >
                      <Close size={24} color={errorColor1} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {availableTags.length > 0 && (
              <Button
                variant="tertiary"
                label={t('add_tag')}
                iconLeft={() => <Plus size={30} />}
                onPress={() => {
                  setIsAddTagModalShown(true);
                }}
                style={styles.addTagButton}
              />
            )}
          </>
        )}
      </ScrollView>
      <Divider style={styles.divider} light />
      <View style={{ paddingBottom: bottom + 20, ...styles.buttonsOuter }}>
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
            variant={isUpdateDisabled ? 'primary' : 'secondary'}
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
              isSpeaking || isProcessing ? undefined : (
                <Microphone color={isUpdateDisabled ? 'white' : buttonColor} />
              )
            }
            disabled={isProcessing}
            onPress={onPressSpeech}
          />
        </View>
        <Animated.View style={bottomButtonsStyle}>
          <View style={styles.updateButtonContainer}>
            <Animated.View style={updateButtonStyle}>
              {(!isUpdateDisabled || isProcessing) && (
                <Button
                  label={t('save_changes')}
                  disabled={isUpdateDisabled}
                  onPress={onPressUpdate}
                  iconLeft={() => <Check color="white" />}
                />
              )}
            </Animated.View>
          </View>
        </Animated.View>
        {isSpeaking && (
          <View style={styles.audioVisualizer}>
            <AudioVisualizer />
          </View>
        )}
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
          onPhotoDeleted?.(image.id);
          resetSpeech();
          navigation.goBack();
        }}
      />
      <ConfirmDeleteTagModal
        isOpen={!!deleteTag}
        onClose={() => setDeleteTag(undefined)}
        onDelete={async () => {
          const linkId = deleteTag?.link_id;
          setDeleteTag(undefined);

          if (linkId) await removeTag(linkId);
        }}
      />
      <PermissionModal
        isOpen={!!permissionStatus}
        onClose={() => setPermissionStatus('')}
        status={permissionStatus}
      />
      <AddTagModal
        tags={availableTags}
        isOpen={isAddTagModalShown}
        onClose={() => {
          setIsAddTagModalShown(false);
        }}
        onAdd={async tagId => {
          await addTag(tagId);
        }}
      />
      {isZoomShown && (
        <Animated.View
          style={[
            zoomStyle,
            {
              ...styles.zoomContainer,
            },
          ]}
        >
          <TouchableOpacity
            style={{ ...styles.closeZoom, top: top + 10 }}
            onPress={() => {
              setIsZoomShown(false);
            }}
          >
            <Close color="black" />
          </TouchableOpacity>
          <ReactNativeZoomableView
            maxZoom={5}
            visualTouchFeedbackEnabled={false}
          >
            <CachedImage
              image={image}
              width={width}
              maxHeight={height - top - bottom - 10}
            />
          </ReactNativeZoomableView>
          <View style={{ ...styles.pinch, bottom }}>
            <Pinch />
            <Label style={styles.pinchText} text={t('pinch_to_zoom')} />
          </View>
        </Animated.View>
      )}
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
  header: {
    flexDirection: 'row',
    gap: 10,
    flexShrink: 1,
    alignItems: 'center',
  },
  container: {
    padding: 16,
  },
  date: {
    marginTop: 10,
    fontSize: 18,
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
  tagsTitle: {
    marginTop: 28,
    marginBottom: 12,
  },
  tags: {
    marginTop: 12,
    marginBottom: 8,
    flexDirection: 'row',
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: bgColor2,
    height: 50,
    paddingLeft: 25,
    paddingRight: 15,
    borderRadius: 25,
    gap: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  addTagButton: {
    alignSelf: 'flex-start',
    height: 50,
    marginTop: 4,
  },
  zoomDescription: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  zoomDescriptionText: {
    color: fontColor2,
    marginBottom: 2,
  },
  pinch: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 24,
    alignSelf: 'center',
    height: 80,
  },
  pinchText: {
    color: 'white',
    fontSize: 18,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  description: {
    height: 120,
    justifyContent: 'flex-start',
    paddingTop: 8,
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
    zIndex: 300,
    flex: 1,
  },
  updateButtonContainer: {
    paddingTop: 10,
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
  divider: {
    marginHorizontal: 16,
  },
  zoomContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000E6',
    zIndex: 100000,
  },
  closeZoom: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFBF',
    zIndex: 100001,
    position: 'absolute',
    right: 14,
  },
  audioVisualizer: {
    zIndex: 300,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 80,
    bottom: 0,
  },
});
