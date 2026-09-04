"use client";

import { FC, useState } from "react";
import { Button } from "@/app/ui/Button/Button";
import { Heading } from "@/app/ui/Heading/Heading";
import { useTranslation } from "react-i18next";
import { Plus } from "@/app/ui/Icons";
import { FormJob, FormJobDownloadFile, UserRole } from "@/types";
import { useForms } from "./useForms";
import CreateFormJobModal from "./CreateFormJobModal";
import FormJobModal from "./FormJobModal";
import DeleteFormJobModal from "./DeleteFormJobModal";
import { Divider, Label, Modal } from "../shared";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../shared/Loader";

const FormsListScreen: FC = () => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const {
    loading,
    formJobs,
    getFormJobs,
    createFormJob,
    deleteFormJob,
    downloadFiles,
    error,
    setError
  } = useForms();
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateFormModalShown, setIsCreateFormModalShown] = useState(false);
  const [showFormJob, setShowFormJob] = useState<FormJob>();
  const [jobToDelete, setJobToDelete] = useState<FormJob>();

  return (
    <>
      <View style={{ paddingTop: top, ...styles.container }}>
        <View style={styles.nav}>
          <Label text={t('forms')} size={24} numberOfLines={1} />
          <Button
            variant="tertiary"
            label={t("upload_form")}
            onPress={() => {
              setIsCreateFormModalShown(true);
            }}
            iconRight={() => <Plus size={30} />}
          />
        </View>
        <Divider />
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.forms}
            data={formJobs}
            renderItem={({ item }) => (
              <FormsListItem
                key={item.id}
                report={item}
                onPress={() => {
                  navigation.navigate('ReportDetailScreen', {
                    reportId: item.id,
                    reportName: item.name,
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
      <CreateFormJobModal
        isOpen={isCreateFormModalShown}
        onClose={() => {
          setIsCreateFormModalShown(false);
        }}
        onSubmit={(
          file,
          name,
          description,
          projectId
        ) => {
          createFormJob(
            file,
            name,
            description,
            projectId
          );
          setIsCreateFormModalShown(false);
        }}
      />
      <FormJobModal
        formJob={showFormJob}
        isOpen={!!showFormJob}
        onClose={() => {
          setShowFormJob(undefined);
        }}
        onDownload={(fileId) => {
          if (!showFormJob) return;

          downloadFiles(showFormJob, fileId);
        }}
        onDelete={() => {
          if (!showFormJob) return;

          setJobToDelete(showFormJob);
          setShowFormJob(undefined);
        }}
      />
      <DeleteFormJobModal
        isOpen={!!jobToDelete}
        onClose={() => {
          setJobToDelete(undefined);
        }}
        onDelete={() => {
          if (!jobToDelete) return;
          deleteFormJob(jobToDelete.id);
          setJobToDelete(undefined);
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
});

export default FormsListScreen;
