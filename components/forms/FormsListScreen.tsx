import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormJob } from "../../types";
import { useFormJobs } from "./useFormJobs";
// import CreateFormJobModal from "./CreateFormJobModal";
import { Button, Divider, Label, Modal } from "../shared";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../shared/Loader";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FormsStackNavigationParams } from "../../navigation/FormsStack";
import { ChevronRight, Form, Camera as CameraIcon } from "../shared/Icons";
import { Camera } from 'react-native-vision-camera';
import { useForms } from "../../context/forms/FormsContext";
import CreateFormJobModal from "./CreateFormJobModal";

interface FormsListScreenProps {
  navigation: NativeStackNavigationProp<
    FormsStackNavigationParams,
    'FormsListScreen'
  >;
}

const FormsListScreen: FC<FormsListScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const {
    loading,
    formJobs,
    getFormJobs,
    createFormJob,
    error,
    setError,
  } = useFormJobs();
  const { photoUri, setPhotoUri } = useForms();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <View style={{ paddingTop: top, ...styles.container }}>
        <View style={styles.nav}>
          <Label text={t('form_list')} size={24} numberOfLines={1} />

        </View>
        <Divider />
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.forms}
            data={formJobs}
            renderItem={({ item }) => (
              <FormsListItem
                key={item.id}
                formJob={item}
                onPress={() => {
                  navigation.navigate('FormDetailScreen', {
                    formJob: item
                  });
                }}
              />
            )}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await getFormJobs();
              setRefreshing(false);
            }}
          />
        </View>
      </View>
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
              navigation.getParent()?.navigate('CameraScreen', {});
            }
          }}
        />
      </View>
      <CreateFormJobModal
        isOpen={!!photoUri}
        onClose={() => {
          setPhotoUri("");
        }}
        onSubmit={(
          name,
          description,
          projectId
        ) => {
          createFormJob(
            photoUri,
            name,
            description,
            projectId
          );
          setPhotoUri("");
        }}
      />
      <Modal
        isOpen={!!error}
        onClose={() => setError('')}
        title={t('error')}
        subtitle={error}
      />
      {loading && !refreshing && <Loader />}
    </>
  );
};

interface FormsListItemProps {
  formJob: FormJob;
  onPress: () => void;
}

export const FormsListItem: FC<FormsListItemProps> = ({
  formJob,
  onPress,
}) => {
  const subtitle = useMemo(() => (
    formJob.files[0].filename
  ), [formJob.files]);

  return (
    <>
      <TouchableOpacity style={styles.form} onPress={onPress}>
        <View style={styles.formInfo}>
          <Form size={26} />
          <View style={styles.labels}>
            <Label
              text={formJob.name}
              style={styles.formName}
              numberOfLines={1}
            />
            <Label
              text={subtitle}
              style={styles.subtitle}
              numberOfLines={1}
              light
            />
          </View>
        </View>
        <View style={styles.chevron}>
          <ChevronRight size={18} />
        </View>
      </TouchableOpacity>
      <Divider light />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  nav: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginRight: -4,
  },
  heading: {
    paddingHorizontal: 16,
  },
  createButton: {
    flex: 1,
  },
  headingDivider: {
    marginTop: 16,
  },
  content: {
    flex: 1,
  },
  forms: {
    flex: 1,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  form: {
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
  },
  formInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  formName: {
    flexShrink: 1,
    includeFontPadding: false
  },
  subtitle: {
    fontSize: 12,
    includeFontPadding: false,
  },
  chevron: {
    marginHorizontal: 12,
  },
  labels: {
    gap: 2,
  },
  buttons: {
    marginHorizontal: 16,
  },
  button: {
    marginVertical: 10,
  },
});

export default FormsListScreen;
