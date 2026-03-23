import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import { ChevronLeft, Menu, Camera as CameraIcon } from '../../shared/Icons';
import { buttonColor } from '../../../constants';
import { ReportPhotosMenu } from './ReportPhotosMenu';
import { CachedImage } from '../../shared/CachedImage';
import { useCamera } from '../../../context/camera/CameraContext';
import { useReport } from '../useReport';

interface ReportPhotosScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportPhotosScreen'
  >;
  route: RouteProp<ReportsStackNavigationParams, 'ReportPhotosScreen'>;
}

export enum ReportPhotosGroupBy {
  None,
  Tag,
  Date,
}

const ReportPhotosScreen: FC<ReportPhotosScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { reportId, deletedImageId } = route.params;
  const { top } = useSafeAreaInsets();
  const { setOnConfirmImage } = useCamera();
  const {
    photos,
    getPhotos,
    addPhoto,
    removePhoto,
    loading: photosLoading,
    error,
    setError,
  } = useReportPhotos(reportId);
  const { uploadImage, loading: reportLoading } = useReport(reportId);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [groupBy, setGroupBy] = useState(ReportPhotosGroupBy.None);
  const screenWidth = Dimensions.get('window').width;
  const loading = photosLoading || reportLoading;

  const columnWidth = useMemo(() => {
    return (screenWidth - 42) / 2;
  }, [screenWidth]);

  useEffect(() => {
    setOnConfirmImage(() => async (uri: string) => {
      const newPhoto = await uploadImage(uri);

      if (newPhoto) {
        addPhoto(newPhoto);
      }
    });

    getPhotos();
  }, []);

  useEffect(() => {
    if (deletedImageId) {
      removePhoto(deletedImageId);
    }
  }, [deletedImageId]);

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
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsMenuShown(true)}
          >
            <Menu size={30} />
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
      <FlashList
        data={photos}
        masonry
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          return (
            <Pressable
              style={styles.image}
              onPress={() =>
                navigation.navigate('PhotoDetailScreen', { image: item })
              }
            >
              <CachedImage image={item} width={columnWidth} />
            </Pressable>
          );
        }}
        contentContainerStyle={styles.images}
      />
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
      <ReportPhotosMenu
        isOpen={isMenuShown}
        onClose={() => setIsMenuShown(false)}
        onGroupBySelected={gb => setGroupBy(gb)}
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
  menuButton: {
    paddingLeft: 18,
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
  button: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
});

export default ReportPhotosScreen;
