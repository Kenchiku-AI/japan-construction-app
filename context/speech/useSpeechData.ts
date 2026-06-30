import { useCallback, useEffect, useRef, useState } from 'react';
import { ReportFieldValues } from '../../types';
import RNFS from 'react-native-fs';
import { initWhisper, releaseAllWhisper } from 'whisper.rn';
import { whisperModelFileName } from '../../constants';
import { Platform } from 'react-native';
import { useApi } from '../../services/api/useApi';
import { useSettings } from '../settings/SettingsContext';
import { useTranscription } from './useTranscription';

export const useSpeechData = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const api = useApi();
  const { reportOutputLanguage } = useSettings();
  const stopRequested = useRef(false);
  const finalTranscriptSent = useRef(false);
  const [showContextLoading, setShowContextLoading] = useState(false);
  const modelFilePath = `${RNFS.DocumentDirectoryPath}/${whisperModelFileName}`;
  const { getRequestText, clearTranscription } = useTranscription();

  useEffect(() => {
    loadModel();

    return () => {
      releaseAllWhisper();
    };
  }, []);

  const loadModel = async () => {
    const modelExists = await RNFS.exists(modelFilePath);
    if (modelExists) return;

    setFirstLoad(true);

    try {
      if (Platform.OS === 'android') {
        await RNFS.copyFileAssets(
          `models/${whisperModelFileName}`,
          modelFilePath,
        );
      } else {
        const src = `${RNFS.MainBundlePath}/${whisperModelFileName}`;
        await RNFS.copyFile(src, modelFilePath);
      }
    } catch (err) {
      console.log('Error loading Whisper model:', err);
    }

    setFirstLoad(false);
  };

  const createWhisperContext = async () => {
    const loadingTimer = setTimeout(() => {
      setShowContextLoading(true);
    }, 1000);

    try {
      await loadModel();

      return await initWhisper({
        filePath: modelFilePath,
      });
    } finally {
      clearTimeout(loadingTimer);
      setShowContextLoading(false);
    }
  };

  const handleEvent = async (
    event: any,
    reportId: string,
    onFieldsReceived: (fieldValues: ReportFieldValues) => void,
    isFinal: boolean,
  ) => {
    if (finalTranscriptSent.current) return;

    const transcription = event.data?.result;
    if (!transcription) return;

    const text = isFinal ? transcription.trim() : getRequestText(transcription);
    if (!text) return;

    const request = { text, output_language: reportOutputLanguage };

    try {
      console.log('🚀 stable chunk commit:', request);

      if (isFinal) finalTranscriptSent.current = true;

      const response = await api.reportSpeech(reportId, request);

      if (response) {
        onFieldsReceived(response.field_values);
      }

      if (isFinal) resetSpeech();
    } catch (err) {
      console.log('Error sending speech:', err);
    }
  };

  const startReportSpeech = useCallback(
    async (
      reportId: string,
      onFieldsReceived: (fieldValues: ReportFieldValues) => void,
    ) => {
      clearTranscription();
      finalTranscriptSent.current = false;
      setIsSpeaking(true);

      try {
        const whisper = await createWhisperContext();

        const transcriber = await whisper.transcribeRealtime({
          realtimeAudioSec: 300,
          realtimeAudioSliceSec: 20,
          realtimeAudioMinSec: 2,
        });

        transcriber.subscribe(async (event: any) => {
          await handleEvent(
            event,
            reportId,
            onFieldsReceived,
            stopRequested.current,
          );
        });
      } catch (err) {
        console.log('Error starting transcription:', err);
      }
    },
    [reportOutputLanguage],
  );

  const startPhotoSpeech = useCallback(
    async (onChange: (text?: string) => void) => {
      setIsSpeaking(true);

      try {
        const whisper = await createWhisperContext();

        const transcriber = await whisper.transcribeRealtime({
          realtimeAudioSec: 300,
          realtimeAudioSliceSec: 20,
          realtimeAudioMinSec: 2,
        });

        transcriber.subscribe(async (event: any) => {
          const text = event.data?.result
            ?.replaceAll('[BLANK_AUDIO]', '')
            .trim();

          onChange(text);

          if (stopRequested.current) resetSpeech();
        });
      } catch (err) {
        console.log('Error starting transcription:', err);
      }
    },
    [reportOutputLanguage],
  );

  const stopSpeech = () => {
    setIsSpeaking(false);
    setIsProcessing(true);
    stopRequested.current = true;
  };

  const resetSpeech = () => {
    clearTranscription();
    setIsSpeaking(false);
    setIsProcessing(false);
    stopRequested.current = false;
    releaseAllWhisper();
  };

  return {
    isSpeaking,
    isProcessing,
    startReportSpeech,
    startPhotoSpeech,
    stopSpeech,
    resetSpeech,
    loadModel,
    firstLoad,
    showContextLoading,
  };
};
