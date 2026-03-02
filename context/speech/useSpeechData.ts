import { useCallback, useEffect, useRef, useState } from 'react';
import { ReportFieldValues } from '../../types';
import RNFS from 'react-native-fs';
import {
  initWhisper,
  releaseAllWhisper,
  WhisperContext,
  WhisperTranscriber,
} from 'whisper.rn';
import { whisperModelFileName } from '../../constants';
import { Platform } from 'react-native';
import { useTranscription } from './useTranscription';
import { useApi } from '../../services/api/useApi';
import { useSettings } from '../settings/SettingsContext';

export const useSpeechData = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const whisper = useRef<WhisperContext>(null);
  const transcriber = useRef<WhisperTranscriber>(null);
  const api = useApi();
  const { reportOutputLanguage } = useSettings();
  const { getRequestText } = useTranscription();
  const stopRequested = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const filePath = `${RNFS.DocumentDirectoryPath}/${whisperModelFileName}`;
        const exists = await RNFS.exists(filePath);

        if (!exists) {
          if (Platform.OS === 'android') {
            await RNFS.copyFileAssets(
              `models/${whisperModelFileName}`,
              filePath,
            );
          } else {
            const src = `${RNFS.MainBundlePath}/models/${whisperModelFileName}`;
            await RNFS.copyFile(src, filePath);
          }
        }

        whisper.current = await initWhisper({ filePath });
      } catch (err) {
        console.log('Error initializing transcriber:', err);
      }
    })();

    return () => {
      releaseAllWhisper();
    };
  }, []);

  const handleCompletion = () => {
    if (!stopRequested.current) return;

    setIsProcessing(false);
    stopRequested.current = false;
    transcriber.current?.stop();
  };

  const startSpeech = useCallback(
    async (
      reportId: string,
      onFieldsReceived: (fieldValues: ReportFieldValues) => void,
    ) => {
      setIsSpeaking(true);

      transcriber.current = await whisper.current?.transcribeRealtime({
        realtimeAudioSec: 300,
        realtimeAudioSliceSec: 20,
        realtimeAudioMinSec: 2,
      });

      transcriber.current?.subscribe(async (event: any) => {
        const transcription = event.data?.result;
        if (!transcription) {
          handleCompletion();
          return;
        }

        const text = getRequestText(transcription);
        if (!text) {
          handleCompletion();
          return;
        }

        const request = { text, output_language: reportOutputLanguage };

        try {
          const response = await api.reportSpeech(reportId, request);
          if (response) {
            onFieldsReceived(response.field_values);
          }
          handleCompletion();
        } catch (err) {
          console.log('Error sending speech:', err);
        }
      });
    },
    [reportOutputLanguage],
  );

  const stopSpeech = () => {
    setIsSpeaking(false);
    setIsProcessing(true);
    stopRequested.current = true;
  };

  const resetSpeech = () => {
    setIsSpeaking(false);
    setIsProcessing(false);
    stopRequested.current = false;
    transcriber.current?.stop();
  };

  return {
    isSpeaking,
    isProcessing,
    startSpeech,
    stopSpeech,
    resetSpeech,
  };
};
