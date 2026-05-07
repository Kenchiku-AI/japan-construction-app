import { FC, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Camera } from 'react-native-vision-camera';
import { ReportsStackNavigationParams } from '../../../navigation/ReportsStack';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Label, Modal } from '../../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReportPhotos } from './useReportPhotos';
import { Loader } from '../../shared/Loader';
import { FlashList } from '@shopify/flash-list';
import { RouteProp } from '@react-navigation/native';
import {
  ChevronLeft,
  Menu,
  Camera as CameraIcon,
  Tag,
} from '../../shared/Icons';
import { buttonColor } from '../../../constants';
import { ReportPhotosTagsMenu } from './ReportPhotosTagsMenu';
import { CachedImage } from '../../shared/CachedImage';
import { useReport } from '../useReport';
import { usePhotos } from '../../../context/photos/PhotosContext';
import {
  ReportImage,
  ReportImageTag,
  ReportImageTagResponse,
} from '../../../types';
import { useTags } from './useTags';

interface ReportPhotosScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportPhotosScreen'
  >;
  route: RouteProp<ReportsStackNavigationParams, 'ReportPhotosScreen'>;
}

const ReportPhotosScreen: FC<ReportPhotosScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { reportId, companyId } = route.params;
  const { top } = useSafeAreaInsets();
  const {
    setOnPhotoAdded,
    setOnPhotoDeleted,
    setOnPhotoUpdated,
    setOnTagsAdded,
    setOnTagRemoved,
    setOnDescriptionAdded,
  } = usePhotos();
  const {
    photos,
    getPhotos,
    addPhoto,
    removePhoto,
    replacePhoto,
    addTags,
    removeTag,
    addDescription,
    loading: photosLoading,
    error,
    setError,
  } = useReportPhotos(reportId);
  const { uploadImage, loading: reportLoading } = useReport(reportId);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ReportImageTagResponse>();
  const screenWidth = Dimensions.get('window').width;
  const loading = photosLoading || reportLoading;
  const { tags: allTags } = useTags(companyId);

  const columnWidth = useMemo(() => {
    return (screenWidth - 42) / 2;
  }, [screenWidth]);

  useEffect(() => {
    setOnPhotoAdded(() => async (uri: string) => {
      console.log('PHOTO ADDED', uri);

      const newPhoto = await uploadImage(uri);
      if (newPhoto) {
        addPhoto(newPhoto);
      }
    });

    setOnPhotoDeleted(() => async (imageId: string) => {
      removePhoto(imageId);
    });

    setOnPhotoUpdated(() => async (photo: ReportImage) => {
      replacePhoto(photo);
    });

    setOnTagsAdded(() => (imageId: string, tags: ReportImageTag[]) => {
      addTags(imageId, tags);
    });

    setOnTagRemoved(() => (imageId: string, linkId: string) => {
      removeTag(imageId, linkId);
    });

    setOnDescriptionAdded(() => (imageId: string, description?: string) => {
      console.log('added description', description);
      addDescription(imageId, description);
    });

    getPhotos();
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!selectedTag) return photos;

    return photos.filter(p => p.tags.some(t => t.tag_id === selectedTag.id));
  }, [selectedTag, photos]);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.navContainer }}>
        <View style={styles.nav}>
          <View style={styles.navLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft color={buttonColor} size={20} />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Label
                text={t('photos')}
                style={styles.title}
                numberOfLines={1}
              />
            </View>
          </View>
          {(allTags?.length ?? 0) > 0 && (
            <TouchableOpacity
              style={styles.tagsButton}
              onPress={() => setIsMenuShown(true)}
            >
              {selectedTag && (
                <Label text={selectedTag.name} style={{ color: buttonColor }} />
              )}
              <Tag size={30} />
            </TouchableOpacity>
          )}
        </View>
        <Divider />
      </View>
      {!loading && filteredPhotos.length === 0 && (
        <View style={styles.emptyPhotos}>
          <Label text={t('empty_photos_description')} light />
        </View>
      )}
      <FlashList
        data={filteredPhotos}
        masonry
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={styles.image}
              onPress={() =>
                navigation
                  .getParent()
                  ?.navigate('PhotoDetailScreen', { image: item, companyId })
              }
            >
              <CachedImage image={item} width={columnWidth} />
            </Pressable>
          );
        }}
        contentContainerStyle={styles.images}
      />
      <View style={styles.buttons}>
        <Divider light />
        <Button
          style={styles.button}
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
              navigation.getParent()?.navigate('CameraScreen', { reportId });
            }
          }}
        />
      </View>
      <ReportPhotosTagsMenu
        isOpen={isMenuShown}
        onClose={() => setIsMenuShown(false)}
        tags={allTags}
        onTagSelected={t => setSelectedTag(t)}
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
  tagsButton: {
    paddingLeft: 18,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  images: {
    paddingLeft: 6,
    paddingRight: 17,
    paddingBottom: 16,
  },
  image: {
    marginTop: 10,
    marginLeft: 10,
  },
  buttons: {
    marginHorizontal: 16,
  },
  button: {
    marginVertical: 10,
  },
  emptyPhotos: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportPhotosScreen;
