declare module 'whisper.rn' {
  export * from 'whisper.rn/src/index';

  export type WhisperTranscriber =
    | {
        stop: () => Promise<void>;
        subscribe: (callback: (event: TranscribeRealtimeEvent) => void) => void;
      }
    | undefined;
}
