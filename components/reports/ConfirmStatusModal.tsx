import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReportStatus } from "../../types";
import { Button } from "../shared/Button";
import { Modal } from "../shared/Modal";
import { StyleSheet, View } from "react-native";

interface ConfirmStatusModalProps {
  currentStatus: ReportStatus;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmStatusModal: FC<ConfirmStatusModalProps> = ({
  currentStatus,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [prefix, setPrefix] = useState("disable");

  useEffect(() => {
    if (!isOpen) return;

    const newPrefix = currentStatus === "closed" ? "open" : "close";
    setPrefix(newPrefix);
  }, [currentStatus, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(`${prefix}_report`)}
      subtitle={t(`${prefix}_report_description`)}
    >
      <View style={styles.buttons}>
        <Button
          label={t(prefix)}
          onPress={onConfirm}
        />
        <Button
          variant="secondary"
          style={{ height: 60, width: "100%" }}
          label={t("cancel")}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttons: {
    gap: 10,
    marginTop: 20,
  }
});


export default ConfirmStatusModal;
