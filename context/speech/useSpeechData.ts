import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ReportFieldValues } from '../../types';
import { useSettings } from '../settings/SettingsContext';
import Voice from '@react-native-voice/voice';

const SILENCE_THRESHOLD = -45;
const SILENCE_DURATION = 700;
const MAX_CHUNK_MS = 4000;

export const useSpeechData = () => {
  const SENTENCE_END = /[。！？!?]/;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken } = useAuth();
  const { reportOutputLanguage } = useSettings();

  useEffect(() => {
    Voice.onSpeechResults = e => {
      console.log('Results', e);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeech = useCallback(
    (
      reportId: string,
      onFieldsReceived: (fieldValues: ReportFieldValues) => void,
    ) => {
      (async () => {
        try {
          await Voice.start('en-US');
        } catch (e) {
          console.error(e);
        }
      })();

      setIsSpeaking(true);
    },
    [accessToken, reportOutputLanguage],
  );

  const stopSpeech = useCallback(() => {
    (async () => {
      try {
        await Voice.stop();
      } catch (e) {
        console.error(e);
      }
    })();

    setIsProcessing(true);
  }, []);

  return {
    isSpeaking,
    isProcessing,
    startSpeech,
    stopSpeech,
  };
};
