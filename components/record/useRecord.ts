import { useCallback, useEffect, useRef, useState } from 'react';
import { useApi } from '../../services/api/useApi';
import { navigate } from '../../navigation/navigate';

export const useRecord = () => {
  const api = useApi();
  const wsRef = useRef<WebSocket | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('');
  }, []);

  const onPressRecord = useCallback(() => {
    if (!isRecording) {
      navigate('RecordScreen');
    }

    setIsRecording(!isRecording);
  }, [api, navigate, isRecording]);

  return {
    isRecording,
    onPressRecord,
  };
};
