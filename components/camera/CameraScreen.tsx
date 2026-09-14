import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Camera,
  PhotoFile,
  useCameraDevices,
} from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { RootStackNavigationParams } from '../../navigation/RootNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Close, Image } from '../shared/Icons';
import { ConfirmPhotoModal } from './ConfirmPhotoModal';
import { usePhotos } from '../../context/photos/PhotosContext';
import { RouteProp } from '@react-navigation/native';
import { RootNavigationParams } from '../../navigation/navigate';
import { useForms } from '../../context/forms/FormsContext';

interface CameraScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackNavigationParams,
    'CameraScreen'
  >;
  route: RouteProp<RootNavigationParams, 'CameraScreen'>;
}

const CameraScreen: FC<CameraScreenProps> = ({ navigation, route }) => {
  const { reportId } = route.params;
  const devices = useCameraDevices();
  const cameraRef = useRef<Camera | null>(null);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [isConfirmPhotoShown, setIsConfirmPhotoShown] = useState(false);
  const { top, bottom } = useSafeAreaInsets();
  const { addPhoto } = usePhotos();
  const { setPhotoUri } = useForms();

  const device = useMemo(() => {
    return devices.find(d => d.position === 'back');
  }, [devices]);

  const format = useMemo(() => {
    if (!device) return undefined;

    return device.formats
      .filter(f => f.photoWidth / f.photoHeight === 4 / 3)
      .sort((a, b) => {
        // Prefer something around 2000x1500
        const aDiff = Math.abs(a.photoWidth - 2000);
        const bDiff = Math.abs(b.photoWidth - 2000);

        return aDiff - bDiff;
      })[0];
  }, [device]);

  useEffect(() => {
    if (!isConfirmPhotoShown) {
      setTimeout(() => {
        setPhoto(undefined);
      }, 500);
    }
  }, [isConfirmPhotoShown]);

  return !device ? null : (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ top: top + 16, ...styles.closeButton }}
          onPress={() => navigation.goBack()}
        >
          <Close color="black" />
        </TouchableOpacity>
        <View style={styles.cameraContainer}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            format={format}
            isActive
            photo
          />


        </View>
      </View>
      <View
        style={{
          ...styles.controls,
          bottom: bottom + 20,
        }}
      >
        <View style={styles.buttonContainer} />

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            if (!cameraRef.current) return;

            const newPhoto = await cameraRef.current.takePhoto();
            setPhoto(newPhoto);
            setIsConfirmPhotoShown(true);
          }}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.libraryButton}
            onPress={async () => {
              try {
                const result = await launchImageLibrary({
                  mediaType: 'photo',
                  quality: 1,
                });

                if (result.didCancel) return;

                const uri = result.assets?.[0]?.uri;
                if (!uri) return;

                if (reportId) {
                  addPhoto(uri, reportId);
                } else {
                  setPhotoUri(uri);
                }

                navigation.goBack();
              } catch (err) {
                console.log(err);
              }
            }}
          >
            <Image />
          </TouchableOpacity>
        </View>
      </View>
      <ConfirmPhotoModal
        photo={photo}
        isOpen={isConfirmPhotoShown}
        onClose={() => {
          setIsConfirmPhotoShown(false);
        }}
        onConfirm={() => {
          setIsConfirmPhotoShown(false);

          if (photo) {
            const uri = `file://${photo.path}`;

            if (reportId) {
              addPhoto(uri, reportId);
            } else {
              setPhotoUri(uri);
            }
          }

          navigation.goBack();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: "center",
  },
  cameraContainer: {
    justifyContent: "center",
    aspectRatio: 3 / 4,
    backgroundColor: 'black',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 20
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center"
  },
  libraryButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF80',
    justifyContent: 'center',
    alignItems: 'center',

  },

  controlSpacer: {
    width: 50,
  },

  closeButton: {
    position: 'absolute',
    right: 16,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#FFFFFF80',
  },
});

export default CameraScreen;
