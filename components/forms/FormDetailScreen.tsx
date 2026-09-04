import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Label } from '../shared';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronLeft,
  Close,
  Trash,
} from '../shared/Icons';
import {
  bgColor1,
  bgColor2,
  buttonColor,
  errorColor1,
  fontColor2,
} from '../../constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Loader } from '../shared/Loader';
import { RootNavigationParams } from '../../navigation/navigate';
import { useFormJob } from './useFormJob';

interface FormDetailScreenProps {
  navigation: NativeStackNavigationProp<
    RootNavigationParams,
    'FormDetailScreen'
  >;
  route: RouteProp<RootNavigationParams, 'FormDetailScreen'>;
}

const FormDetailScreen: FC<FormDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { formJob } = route.params;
  const { } = useFormJob(formJob.id);
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [isConfirmDeleteShown, setIsConfirmDeleteShown] = useState(false);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.navContainer }}>
        <View style={styles.nav}>
          <View style={styles.navLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <ChevronLeft color={buttonColor} size={20} />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Label
                text={formJob.name}
                style={styles.title}
                numberOfLines={1}
              />
            </View>
          </View>

        </View>
        <Divider />
      </View>
      <ScrollView
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.container}
      >


        <Button
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          variant="secondary"
          label={t('delete')}
          iconLeft={() => <Trash color={errorColor1} />}
          onPress={() => setIsConfirmDeleteShown(true)}
        />
      </ScrollView>
      {/* <ConfirmDeleteFormModal
        isOpen={isConfirmDeleteShown}
        onClose={() => setIsConfirmDeleteShown(false)}
        onDelete={async () => {
          setIsConfirmDeleteShown(false);
          navigation.goBack();
        }}
      /> */}
      {/* {loading && <Loader />} */}
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
    paddingTop: Platform.OS === "android" ? 0 : 12,
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

export default FormDetailScreen