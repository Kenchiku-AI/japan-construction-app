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
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Close, Image } from '../shared/Icons';
import { ConfirmPhotoModal } from './ConfirmPhotoModal';
import { useReport } from '../reports/useReport';
import { useCamera } from '../../context/camera/CameraContext';

interface CameraScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackNavigationParams,
    'CameraScreen'
  >;
}

const CameraScreen: FC<CameraScreenProps> = ({ navigation }) => {
  const { onConfirmImage } = useCamera();
  const devices = useCameraDevices();
  const cameraRef = useRef<Camera | null>(null);
  const [photo, setPhoto] = useState<PhotoFile>();
  const [isConfirmPhotoShown, setIsConfirmPhotoShown] = useState(false);
  const { top, bottom } = useSafeAreaInsets();

  const device = useMemo(() => {
    return devices.find(d => d.position === 'back');
  }, [devices]);

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
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive
          photo
        />
        <TouchableOpacity
          style={{ top, ...styles.closeButton }}
          onPress={() => navigation.goBack()}
        >
          <Close />
        </TouchableOpacity>

        <View style={{ ...styles.buttonContainer, bottom: bottom + 50 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              if (!cameraRef.current) return;

              const newPhoto = await cameraRef.current.takePhoto();
              setPhoto(newPhoto);
              setIsConfirmPhotoShown(true);
            }}
          />
        </View>
        <View style={{ ...styles.libraryButtonContainer, bottom: bottom + 50 }}>
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

                onConfirmImage?.(uri);
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

          if (photo && onConfirmImage) {
            onConfirmImage(`file://${photo.path}`);
          }

          navigation.goBack();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
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
  camera: {
    ...StyleSheet.absoluteFill,
  },
  libraryButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#FFFFFF80',
  },
  libraryButtonContainer: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    paddingLeft: 40,
    height: 80,
    width: '50%',
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
});

export default CameraScreen;
