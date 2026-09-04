import { FC, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../shared/Select";
import { useAuth } from "../../context/auth/AuthContext";
import { ProjectStatus } from "../../types";
import { Button, Input, Modal } from "../shared";
import { StyleSheet, View } from "react-native";

interface CreateFormJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    projectId?: string
  ) => void;
}

const CreateFormJobModal: FC<CreateFormJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("none");
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  const projectOptions = useMemo(() => {
    const projects = currentUser?.projects
      .filter((p) => p.status === ProjectStatus.Active)
      .map((p) => ({
        label: p.name,
        value: p.id,
      })) ?? [];

    return [
      { label: t("none"), value: "none" },
      ...projects
    ]
  }, [currentUser?.projects]);

  const reset = () => {
    setTimeout(() => {
      setName("");
      setDescription("");
      setProjectId("");
    }, 500);
  };

  const closeAndReset = () => {
    onClose();
    reset();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAndReset}
      title={t("upload_form")}
      subtitle={t("upload_form_description")}
    >
      <View style={styles.fields}>
        <Input
          value={name}
          placeholder={t("name")}
          onChange={setName}
        />
        <Input
          value={description}
          placeholder={t("description")}
          onChange={setDescription}
        />
        {projectOptions.length > 1 && (
          <Select
            options={projectOptions}
            value={projectId}
            setValue={setProjectId}
            placeholder={t('project')}
          />
        )}
      </View>
      <Button
        disabled={!name || !description}
        label={t("upload")}
        onPress={() => {
          onSubmit(name, description, projectId);
          closeAndReset();
        }}
      />
    </Modal >
  );
};

const styles = StyleSheet.create({
  fields: {
    gap: 10,
    marginBottom: 20
  }
});

export default CreateFormJobModal;