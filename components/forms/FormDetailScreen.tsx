import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Label, Modal } from '../shared';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ChevronLeft,
  Download,
  Form,
  Trash,
} from '../shared/Icons';
import {
  buttonColor,
  errorColor1,
  fontColor2,
} from '../../constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootNavigationParams } from '../../navigation/navigate';
import { useFormJob } from './useFormJob';
import { useAuth } from '../../context/auth/AuthContext';
import { FormJobFile, FormJobStatus } from '../../types';
import { useForms } from '../../context/forms/FormsContext';
import { Loader } from '../shared/Loader';
import DeleteFormJobModal from './DeleteFormJobModal';

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
  const { formJobId } = route.params;
  const {
    downloadFile,
    deleteFormJob,
    error,
    setError,
    loading
  } = useFormJob(formJobId);
  const { formJobs } = useForms();
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [files, setFiles] = useState<FormJobFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [missingData, setMissingData] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isConfirmDeleteShown, setIsConfirmDeleteShown] = useState(false);

  useEffect(() => {
    const formJob = formJobs.find((f) => f.id === formJobId);

    if (!formJob) {
      setTimeout(() => {
        setTitle("");
        setDescription("");
        setProjectName("");
        setFiles([]);
        setStatus("");
        setSummary("");
        setMissingData([]);
        setRecommendations([]);
        setIsProcessing(false);
      }, 500);
      return;
    }

    setTitle(formJob.name ?? "");
    setDescription(formJob.description ?? "");
    setStatus(t(formJob.status));

    setIsProcessing(
      formJob.status === FormJobStatus.Pending ||
      formJob.status === FormJobStatus.Processing
    );

    if (formJob.project_id) {
      const project = currentUser?.projects.find((p) => (
        p.id === formJob.project_id
      ));

      setProjectName(project?.name ?? "");
    } else {
      setProjectName("");
    }

    const completedFiles = formJob.files.filter((f) => !f.is_input);
    setFiles(completedFiles.length ? completedFiles : formJob.files);

    if (formJob.result_json?.output) {
      const {
        summary,
        missing_data,
        recommendations
      } = formJob.result_json.output;

      setSummary(summary ?? "");
      setMissingData(missing_data ?? []);
      setRecommendations(recommendations ?? []);
    }
  }, [formJobs, currentUser?.projects]);

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
                text={title}
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
        <View style={styles.files}>
          {files.map((file, i) => (
            <>
              {i > 0 && <Divider light />}
              <TouchableOpacity
                style={styles.file}
                disabled={isProcessing}
                onPress={() => {
                  downloadFile(file.id);
                }}
              >
                <View style={styles.filename}>
                  <Form />
                  <Label text={file.filename} />
                </View>
                {!isProcessing && (
                  <Download />
                )}
              </TouchableOpacity>
            </>
          ))}
        </View>
        <Row label={t("description")} value={description} hideDivider />
        {!!projectName && (
          <Row label={t("project")} value={projectName} />
        )}
        <Row label={t("status")} value={status} />
        {!!summary && (
          <Row label={t("summary")} value={summary} />
        )}
        {!!missingData.length && (
          <Row label={t("missing_data")} value={missingData} />
        )}
        {!!recommendations.length && (
          <Row label={t("recommendations")} value={recommendations} />
        )}
      </ScrollView>
      <View style={styles.buttons}>
        <Divider light />
        <Button
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          variant="secondary"
          label={t('delete')}
          iconLeft={() => <Trash color={errorColor1} />}
          onPress={() => setIsConfirmDeleteShown(true)}
        />
      </View>
      <DeleteFormJobModal
        isOpen={isConfirmDeleteShown}
        onClose={() => setIsConfirmDeleteShown(false)}
        onDelete={async () => {
          setIsConfirmDeleteShown(false);
          const success = await deleteFormJob();

          if (success) {
            navigation.goBack();
          }
        }}
      />
      <Modal
        isOpen={!!error}
        onClose={() => setError('')}
        title={t('error')}
        subtitle={error}
      />
      {loading && <Loader />}
    </>
  );
};

interface RowProps {
  label: string;
  value: string | string[];
  hideDivider?: boolean;
}

const Row: FC<RowProps> = ({ label, value, hideDivider }) => (
  <>
    {!hideDivider && <Divider light />}
    <View
      style={styles.row}
    >
      <View>
        <Label text={label} style={styles.label} />
      </View>
      <View>
        {Array.isArray(value) ? (
          value.length > 1 ? (
            <View style={styles.bullets}>
              {value.map((item, index) => (
                <View style={styles.bullet} key={index}>
                  <Label text="•" />
                  <Label text={item} />
                </View>
              ))}
            </View>
          ) : (
            <Label text={value[0]} />
          )
        ) : (
          <Label text={value} />
        )}
      </View>
    </View>
  </>
);

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
    paddingHorizontal: 16,
  },
  files: {
    borderWidth: 1,
    borderColor: fontColor2,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 4,
  },
  file: {
    padding: 16,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  filename: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center"
  },
  row: {
    padding: 12,
    gap: 3
  },
  label: {
    color: fontColor2,
    fontSize: 14
  },
  bullets: {
    gap: 3
  },
  bullet: {
    flexDirection: "row",
    gap: 6,
    marginLeft: -12
  },
  buttons: {
    paddingHorizontal: 16
  },
  deleteButton: {
    borderColor: errorColor1,
    marginVertical: 10
  },
  deleteButtonText: {
    color: errorColor1,
  },
});

export default FormDetailScreen