import { FC, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../../navigation/ReportsStack';
import { Menu } from '../../shared/Icons';
import { useTranslation } from 'react-i18next';
import { Divider, Label, Modal } from '../../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReportPhotos } from './useReportPhotos';
import { Loader } from '../../shared/Loader';
import { FlashList } from '@shopify/flash-list';
import { RouteProp } from '@react-navigation/native';
import { ChevronLeft } from '../../shared/Icons';
import { buttonColor } from '../../../constants';
import { ReportPhotosMenu } from './ReportPhotosMenu';
import { CachedImage } from '../../shared/CachedImage';
import { PhotoDetailsModal } from './PhotoDetailsModal';
import { ReportImage } from '../../../types';

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
  const { reportId } = route.params;
  const { top } = useSafeAreaInsets();
  const { photos, deletePhoto, loading, error, setError } =
    useReportPhotos(reportId);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [isDetailModalShown, setIsDetailModalShown] = useState(false);
  const [groupBy, setGroupBy] = useState(ReportPhotosGroupBy.None);
  const [selectedPhoto, setSelectedPhoto] = useState<ReportImage>();
  const screenWidth = Dimensions.get('window').width;

  const columnWidth = useMemo(() => {
    return (screenWidth - 42) / 2;
  }, [screenWidth]);

  useEffect(() => {
    if (selectedPhoto) {
      setIsDetailModalShown(true);
    }
  }, [selectedPhoto]);

  const closePhotoDetailsModal = () => {
    setIsDetailModalShown(false);

    setTimeout(() => {
      setSelectedPhoto(undefined);
    }, 500);
  };

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
              onPress={() => setSelectedPhoto(item)}
            >
              <CachedImage image={item} width={columnWidth} />
            </Pressable>
          );
        }}
        contentContainerStyle={styles.images}
      />
      <ReportPhotosMenu
        isOpen={isMenuShown}
        onClose={() => setIsMenuShown(false)}
        onGroupBySelected={gb => setGroupBy(gb)}
      />
      <PhotoDetailsModal
        image={selectedPhoto}
        isOpen={isDetailModalShown}
        onClose={() => {
          closePhotoDetailsModal();
        }}
        onDelete={() => {
          if (selectedPhoto) {
            deletePhoto(selectedPhoto.id);
          }

          closePhotoDetailsModal();
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
});

export default ReportPhotosScreen;
