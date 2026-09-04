import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal } from "../shared";


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
      {/* <div className="mt-8 flex flex-col gap-3">
        <Button label={t("delete")} onPress={onDelete} />
        <Button
          variant="secondary"
          style={{ height: 60 }}
          label={t("cancel")}
          onPress={onClose}
        />
      </div> */}
    </Modal>
  );
};

export default DeleteFormJobModal;
