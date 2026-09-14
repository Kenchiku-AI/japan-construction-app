import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../shared/Select";
import { useAuth } from "../../context/auth/AuthContext";
import { ProjectStatus } from "../../types";
import { Button, Input, Label, Modal } from "../shared";
import { Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { bgColor2, buttonColor } from "../../constants";

interface CreateFormJobModalProps {
  isOpen: boolean;
  photoUri?: string;
  onClose: () => void;
  onSubmit: (
    name: string,
    description: string,
    projectId?: string
  ) => void;
  onChangeImage: () => void;
}

const CreateFormJobModal: FC<CreateFormJobModalProps> = ({
  isOpen,
  onClose,
  photoUri,
  onSubmit,
  onChangeImage,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uri, setUri] = useState("");
  const [projectId, setProjectId] = useState("none");
  const { currentUser } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!photoUri) return;

    setUri(photoUri);
  }, [photoUri]);

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
      setUri("");
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
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View
          style={styles.fields}
        >
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={onChangeImage}
          >
            <View style={styles.photoInfo}>
              <View style={styles.photo}>
                <Image
                  style={{ flex: 1 }}
                  resizeMode="contain"
                  source={{ uri }}
                />
              </View>
              <Label text={t("change_image")} style={{ color: buttonColor }} />
            </View>
          </TouchableOpacity>
          <Input
            value={name}
            placeholder={t("name")}
            onChange={setName}
          />
          <Input
            value={description}
            placeholder={t("description_instructions")}
            onChange={setDescription}
            style={styles.description}
            multiline
          />
          {projectOptions.length > 1 && (
            <Select
              options={projectOptions}
              value={projectId}
              setValue={setProjectId}
              placeholder={t('project')}
              openUpward
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
      </ScrollView>
    </Modal >

  );
};

const styles = StyleSheet.create({
  fields: {
    gap: 10,
    marginVertical: 20
  },
  description: {
    height: 120,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? 0 : 12,
  },
  photoContainer: {
    height: 60,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: bgColor2
  },
  photoInfo: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  photo: {
    height: 48,
    width: 48
  }
});

export default CreateFormJobModal;