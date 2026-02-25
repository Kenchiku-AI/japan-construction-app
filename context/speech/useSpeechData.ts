import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Buffer } from 'buffer';
import { ReportFieldValues } from '../../types';
import { useSettings } from '../settings/SettingsContext';
import { RealtimeTranscriber } from 'whisper.rn/realtime-transcription';

const SILENCE_THRESHOLD = -45;
const SILENCE_DURATION = 700;
const MAX_CHUNK_MS = 4000;

export const useSpeechData = () => {
  const whisper = useRef<any>(null);
  const vad = useRef<any>(null);
  const audioBuffer = useRef<Float32Array[]>([]);
  const [ready, setReady] = useState(false);
  const SENTENCE_END = /[。！？!?]/;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken } = useAuth();
  const { reportOutputLanguage } = useSettings();

  const startSpeech = useCallback(
    (
      reportId: string,
      onFieldsReceived: (fieldValues: ReportFieldValues) => void,
    ) => {
      setIsSpeaking(true);
    },
    [accessToken, reportOutputLanguage],
  );

  const stopSpeech = useCallback(() => {
    setIsProcessing(true);
  }, []);

  return {
    isSpeaking,
    isProcessing,
    startSpeech,
    stopSpeech,
  };
};
