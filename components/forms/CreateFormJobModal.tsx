import { FC, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../shared/Select";
import { useAuth } from "../../context/auth/AuthContext";
import { ProjectStatus } from "../../types";
import { Button, Input, Modal } from "../shared";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useKeyboard } from "../../services/keyboard/useKeyboard";
import { scheduleOnRN } from "react-native-worklets";

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
  const { isKeyboardVisible } = useKeyboard();

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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const dismissKeyboardGesture = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX([-20, 20])
    .onEnd((event) => {
      if (isKeyboardVisible && event.translationY > 50) {
        scheduleOnRN(dismissKeyboard);
      }
    });

  return (
    <GestureDetector gesture={dismissKeyboardGesture}>
      <Modal
        isOpen={isOpen}
        onClose={closeAndReset}
        title={t("upload_form")}
        subtitle={t("upload_form_description")}
      >

        <View
          style={styles.fields}
        >
          <Input
            value={name}
            placeholder={t("name")}
            onChange={setName}
          />
          <Input
            value={description}
            placeholder={t("description")}
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
      </Modal >
    </GestureDetector>
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
});

export default CreateFormJobModal;