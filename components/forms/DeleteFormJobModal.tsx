import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../shared";
import { StyleSheet, View } from "react-native";

interface DeleteFormJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteFormJobModal: FC<DeleteFormJobModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("delete_form")}
      subtitle={t("delete_form_description")}
    >
      <View style={styles.buttons}>
        <Button
          label={t('delete_report')}
          onPress={() => {
            onDelete();
          }}
        />
        <Button variant="secondary" label={t('cancel')} onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttons: {
    marginTop: 20,
    gap: 10,
  },
});


export default DeleteFormJobModal;
