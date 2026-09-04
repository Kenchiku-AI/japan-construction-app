"use client";

import { useCallback, useEffect, useState } from "react";
import { useApi } from '../../services/api/useApi';
import { useTranslation } from "react-i18next";
import { CreateFormJobRequest, FormJob, FormJobStatus } from "../../types";
import RNFS from "react-native-fs";
import Share from "react-native-share";
import JSZip from "jszip";

export const useFormJob = (formJobId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const api = useApi();

  const { t } = useTranslation();

  const deleteFormJob = async () => {
    setLoading(true);

    try {
      await api.deleteFormJob(formJobId);

      setFormJobs((prev) => {
        return prev?.filter((f) => f.id !== formJobId);
      })
    } catch (err) {
      setError(t("error_description"));
    }

    setLoading(false);
  };

  const pollFormJob = async () => {
    let failCount = 0;

    for (let attempt = 0; attempt < 200; attempt++) {
      try {
        const response = await api.getFormJob(formJobId);

        if (!response) {
          throw new Error("Failed to get form job status.");
        }

        setFormJobs((prev) => {
          const index = (prev ?? []).findIndex((f) => f.id === formJobId);

          if (index === -1) {
            return [
              response,
              ...(prev ?? []),
            ]
          }

          const newJobs = [...(prev ?? [])];
          newJobs[index] = response;
          return newJobs;
        });

        if (
          response.status === FormJobStatus.Completed ||
          response.status === FormJobStatus.NeedsReview ||
          response.status === FormJobStatus.Failed
        ) {
          return;
        }
      } catch (e) {
        failCount += 1;
        if (failCount > 2) return;
      }

      await new Promise(
        (resolve) => setTimeout(resolve, 3000),
      );
    }
  };

  const downloadFiles = async (formJob: FormJob, fileId?: string) => {
    setLoading(true);

    try {
      const response = await api.downloadFormJobFiles(formJob.id);

      if (!response) {
        throw new Error();
      }

      const { files } = response;

      if (!fileId) {
        const zip = new JSZip();

        await Promise.all(
          files.map(async (file) => {
            const response = await fetch(file.download_url);

            if (!response.ok) {
              throw new Error(
                `Failed to download ${file.filename}: ${response.status}`
              );
            }

            const arrayBuffer = await response.arrayBuffer();

            zip.file(file.filename, arrayBuffer);
          })
        );

        const zipBase64 = await zip.generateAsync({
          type: "base64",
        });

        const filename = `${formJob.name
          .replace(/ /g, "_")
          .replace(/[()]/g, "")}.zip`;

        const filePath = `${RNFS.CachesDirectoryPath}/${filename}`;

        await RNFS.writeFile(
          filePath,
          zipBase64,
          "base64"
        );

        await Share.open({
          url: `file://${filePath}`,
          type: "application/zip",
          filename,
          failOnCancel: false,
        });
      } else {
        const file = files.find((f) => f.id === fileId);

        if (!file) {
          throw new Error();
        }

        const filePath = `${RNFS.CachesDirectoryPath}/${file.filename}`;

        const download = RNFS.downloadFile({
          fromUrl: file.download_url,
          toFile: filePath,
        });

        const result = await download.promise;

        if (result.statusCode !== 200) {
          throw new Error(
            `Failed to download ${file.filename}: ${result.statusCode}`
          );
        }

        await Share.open({
          url: `file://${filePath}`,
          type: getMimeType(file.filename),
          filename: file.filename,
          failOnCancel: false,
        });
      }
    } catch (e) {
      setError(t("error_description"));
    } finally {
      setLoading(false);
    }
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

      default:
        return "application/octet-stream";
    }
  };

  return {
    loading,
    deleteFormJob,
    downloadFiles,
    error,
    setError
  };
};
