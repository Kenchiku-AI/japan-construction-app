"use client";

import { useCallback, useState } from "react";
import { useApi } from '../../services/api/useApi';
import { useTranslation } from "react-i18next";
import { FormJob } from "../../types";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { useForms } from "../../context/forms/FormsContext";

export const useFormJob = (formJobId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { formJobs, setFormJobs } = useForms();
  const api = useApi();

  const { t } = useTranslation();

  const deleteFormJob = async () => {
    let success = false;

    setLoading(true);

    try {
      await api.deleteFormJob(formJobId);
      success = true;

      setFormJobs((prev) => {
        return prev?.filter((f) => f.id !== formJobId);
      })
    } catch (err) {
      setError(t("error_description"));
    }

    setLoading(false);

    return success;
  };

  const getMimeType = (filename: string) => {
    const extension = filename
      .split(".")
      .pop()
      ?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "application/pdf";

      case "doc":
        return "application/msword";

      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

      case "xls":
        return "application/vnd.ms-excel";

      case "xlsx":
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      case "csv":
        return "text/csv";

      case "zip":
        return "application/zip";

      case "jpg":
      case "jpeg":
        return "image/jpeg";

      case "png":
        return "image/png";

      case "gif":
        return "image/gif";

      case "webp":
        return "image/webp";

      case "txt":
        return "text/plain";

      default:
        return "application/octet-stream";
    }
  };

  const downloadAndShareFile = async (
    filename: string,
    downloadUrl: string,
  ) => {
    const filePath = `${RNFS.CachesDirectoryPath}/${filename}`;

    // Remove an existing cached file with the same name.
    if (await RNFS.exists(filePath)) {
      await RNFS.unlink(filePath);
    }

    const download = RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: filePath,
    });

    const result = await download.promise;

    if (result.statusCode !== 200) {
      throw new Error(
        `Failed to download ${filename}: ${result.statusCode}`
      );
    }

    try {
      await Share.open({
        url: `file://${filePath}`,
        type: getMimeType(filename),
        filename,
        failOnCancel: false,
      });
    } finally {
      // The share sheet has already received the file.
      // Give the native share operation a moment before deleting it.
      setTimeout(async () => {
        try {
          if (await RNFS.exists(filePath)) {
            await RNFS.unlink(filePath);
          }
        } catch {
          // Ignore cleanup errors.
        }
      }, 1000);
    }
  };

  const downloadFile = useCallback(async (fileId: string) => {
    const formJob = formJobs.find((f) => f.id === formJobId);
    if (!formJob) return;

    setLoading(true);

    try {
      const response = await api.downloadFormJobFiles(formJob.id);

      if (!response) {
        throw new Error("Failed to get files");
      }

      const { files } = response;
      const file = files.find((f) => f.id === fileId);

      if (!file) {
        throw new Error("File not found");
      }

      await downloadAndShareFile(
        file.filename,
        file.download_url,
      );
    } catch (e) {
      console.error("Download/share error:", e);
      setError(t("error_description"));
    } finally {
      setLoading(false);
    }
  }, [formJobs]);


  return {
    loading,
    deleteFormJob,
    downloadFile,
    error,
    setError
  };
};
