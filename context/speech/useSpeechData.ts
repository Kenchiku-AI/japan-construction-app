import { useCallback, useRef, useState } from 'react';
import { wsUrl } from '../../constants';
import LiveAudioStream from 'react-native-live-audio-stream';
import { useAuth } from '../auth/AuthContext';
import { Buffer } from 'buffer';
import { ReportFieldValues } from '../../types';
import { useSettings } from '../settings/SettingsContext';

export const useSpeechData = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken } = useAuth();
  const { reportOutputLanguage } = useSettings();

  const startSpeech = useCallback(
    (
      reportId: string,
      onComplete: (fieldValues: ReportFieldValues) => void,
    ) => {
      setIsSpeaking(true);

      const ws = new WebSocket(`ws://${wsUrl}/${reportId}/audio`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ language: reportOutputLanguage }));

        LiveAudioStream.init({
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          bufferSize: 4096,
          wavFile: '',
        });

        LiveAudioStream.on('data', (b64: string) => {
          if (ws.readyState === WebSocket.OPEN) {
            const chunk = Buffer.from(b64, 'base64');
            ws.send(chunk);
          }
        });

        LiveAudioStream.start();
      };

      ws.onmessage = e => {
        const msg = JSON.parse(e.data);

        if (msg.type === 'partial_transcript') {
          console.log('Partial:', msg.text);
        }

        if (msg.type === 'final_transcript') {
          console.log('Final:', msg.text);
        }

        if (msg.type === 'processing') {
          setIsProcessing(true);
          console.log('Processing speech to JSON...');
        }

        if (msg.type === 'report_updated') {
          onComplete(msg.payload);
          ws.close();
        }
      };

      ws.onerror = err => {
        console.error('WebSocket error', err);
      };

      ws.onclose = () => {
        LiveAudioStream.stop();
        setIsSpeaking(false);
        setIsProcessing(false);
      };
    },
    [accessToken, reportOutputLanguage],
  );

  const cancelSpeech = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send('CANCEL');
    ws.close();
  }, []);

  const completeSpeech = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    ws.send('COMPLETE');
  }, []);

  return {
    isSpeaking,
    isProcessing,
    startSpeech,
    cancelSpeech,
    completeSpeech,
  };
};
