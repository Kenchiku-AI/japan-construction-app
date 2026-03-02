declare module 'whisper.rn' {
  export * from 'whisper.rn/index.js';

  export type WhisperTranscriber =
    | {
        stop: () => Promise<void>;
        subscribe: (callback: (event: TranscribeRealtimeEvent) => void) => void;
      }
    | undefined;
}
