import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ReportFieldValues } from '../../types';
import { useSettings } from '../settings/SettingsContext';
import RNFS from 'react-native-fs';
import {
  initWhisper,
  releaseAllWhisper,
  // initWhisperVad,
  // releaseAllWhisperVad,
} from 'whisper.rn';
import {
  RealtimeTranscriber,
  // RingBufferVad,
} from 'whisper.rn/src/realtime-transcription';
// import { AudioPcmStreamAdapter } from 'whisper.rn/src/realtime-transcription/adapters/AudioPcmStreamAdapter';
import {
  speechModelFileName,
  // vadModelFileName
} from '../../constants';
import { Platform } from 'react-native';

const realtimeOptions = {
  realtimeAudioSec: 300,
  realtimeAudioSliceSec: 20,
  realtimeAudioMinSec: 2,
};

export const useSpeechData = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { accessToken } = useAuth();
  const { reportOutputLanguage } = useSettings();
  // const transcriber = useRef<typeof RealtimeTranscriber>(null);
  const whisper = useRef<any>(null);

  useEffect(() => {
    const loadModel = async (fileName: string) => {
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const exists = await RNFS.exists(path);

      if (!exists) {
        try {
          if (Platform.OS === 'android') {
            await RNFS.copyFileAssets(`models/${fileName}`, path);
          } else {
            const src = `${RNFS.MainBundlePath}/models/${fileName}`;
            await RNFS.copyFile(src, path);
            console.log('file copied!');
          }
        } catch (err) {
          console.log('Error copying model file:', err);
        }
      }

      return path;
    };

    (async () => {
      try {
        const whisperPath = await loadModel(speechModelFileName);
        whisper.current = await initWhisper({ filePath: whisperPath });

        // const vadPath = await loadModel(vadModelFileName);
        // const vad = await initWhisperVad({ filePath: vadPath });

        // const vadContext = new RingBufferVad(vad);
        // const audioStream = new AudioPcmStreamAdapter();

        // transcriber.current = new RealtimeTranscriber(
        //   {
        //     whisperContext: whisper.current,
        //     vadContext,
        //     audioStream,
        //     fs: RNFS,
        //   },
        //   realtimeOptions,
        // );

        console.log('successfully loaded transcriber');
      } catch (err) {
        console.log('Error initializing transcriber:', err);
      }
    })();

    return () => {
      releaseAllWhisper();
      // releaseAllWhisperVad();
    };
  }, []);

  const startSpeech = useCallback(
    (
      reportId: string,
      onFieldsReceived: (fieldValues: ReportFieldValues) => void,
    ) => {
      setIsSpeaking(true);
      (async () => {
        const { stop, subscribe } = await whisper.current?.transcribeRealtime(
          realtimeOptions,
        );

        subscribe((event: any) => {
          console.log('result', event.data?.result);
        });
      })();

      // transcriber.current?.updateCallbacks({
      //   onVad: (e: any) => {
      //     // console.log('VAD:', e.type, e.confidence);
      //   },
      //   onTranscribe: (e: any) => {
      //     console.log('Transcription:', e.data?.result);
      //   },
      //   onError: (e: any) => {
      //     // console.error('Error:', e);
      //   },
      //   onSliceTranscriptionStabilized: (text: any) => {
      //     console.log('Stabilized:', text);
      //   },
      // });

      // transcriber.current?.start();
    },
    [accessToken, reportOutputLanguage],
  );

  const stopSpeech = useCallback(
    () => {
      // setIsProcessing(true);
      setIsSpeaking(false);
      // transcriber.current?.stop();
    },
    [
      // transcriber
    ],
  );

  return {
    isSpeaking,
    isProcessing,
    startSpeech,
    stopSpeech,
  };
};
