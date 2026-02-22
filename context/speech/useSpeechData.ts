import { useCallback, useRef, useState } from 'react';
import { wsUrl } from '../../constants';
import LiveAudioStream from 'react-native-live-audio-stream';
import { useAuthContext } from '../auth/AuthContext';
import { Buffer } from 'buffer';

export const useSpeechData = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const [partial, setPartial] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { accessToken } = useAuthContext();

  const start = useCallback(
    (reportId: string) => {
      setIsSpeaking(true);

      const ws = new WebSocket(`ws://${wsUrl}/${reportId}/audio`, null, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            language: 'English', // or "Japanese"
          }),
        );

        LiveAudioStream.init({
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          bufferSize: 4096,
          wavFile: '',
        });

        LiveAudioStream.on('data', (b64: string) => {
          if (ws.readyState === 1) {
            const chunk = Buffer.from(b64, 'base64');
            ws.send(chunk);
          }
        });

        LiveAudioStream.start();
      };

      ws.onmessage = e => {
        const msg = JSON.parse(e.data);

        if (msg.type === 'partial_transcript') setPartial(msg.text);

        if (msg.type === 'final_transcript') {
          setFinalText(prev => prev + ' ' + msg.text);
          setPartial('');
        }
      };

      ws.onerror = console.error;

      ws.onclose = () => {
        LiveAudioStream.stop();
        setIsSpeaking(false);
      };
    },
    [accessToken],
  );

  const stop = () => {
    setIsSpeaking(false);

    const ws = wsRef.current;
    if (!ws) return;

    ws.send('STOP');
    ws.close();
  };

  return {
    isSpeaking,
    start,
  };
};
