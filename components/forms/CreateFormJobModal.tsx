import { FC, useMemo, useRef, useState } from "react";
import { Button } from "@/app/ui/Button/Button";
import { useTranslation } from "react-i18next";
import { Input } from "@/app/ui/Input/Input";
import Modal from "@/app/ui/Modal";
import { TextArea } from "@/app/ui/TextArea/TextArea";
import { Close, Form, Trash } from "@/app/ui/Icons";
import { bgColor5, errorColor1, fontColor1, fontColor2 } from "@/lib/constants";


import { ProjectStatus } from "@/types";
import { Select } from "../shared/Select";
import { useAuth } from "../../context/auth/AuthContext";

interface CreateFormJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    file: File,
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
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("none");
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const reset = () => {
    setTimeout(() => {
      removeFile();
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
      width={640}
    >
      <div className="my-8 flex flex-col gap-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {!file ? (
          <div
            style={{
              height: 60,
              borderColor: bgColor5
            }}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer hover:opacity-50 flex w-full items-center rounded-lg border-2 border-dashed px-5 gap-3"
          >
            <Form color={fontColor1} />

            <div style={{ color: fontColor2 }}>
              {t("choose_file")}
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-between rounded-lg border-2 px-5"
            style={{
              height: 60,
              borderColor: bgColor5
            }}
          >
            <div
              className="cursor-pointer hover:opacity-50 flex gap-3 items-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Form color={fontColor1} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {file.name}
                </p>
                <p className="text-xs text-base-content/60">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={removeFile}
            >
              <Close color={errorColor1} />
            </div>
          </div>
        )}

        <Input
          value={name}
          placeholder={t("name")}
          onChange={setName}
        />

        <TextArea
          value={description}
          placeholder={t("description")}
          onChange={setDescription}
        />

        <Select
          options={projectOptions}
          value={projectId}
          placeholder={t("project")}
          onChange={(id) => setProjectId(id as string)}
          style={{ paddingRight: 40 }}
        />
      </div>

      <Button
        disabled={!file || !name || !description}
        label={t("upload")}
        onClick={() => {
          if (!file) return;

          onSubmit(file, name, description, projectId);
          closeAndReset();
        }}
      />
    </Modal>
  );
};

export default CreateFormJobModal;