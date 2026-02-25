declare module 'whisper.rn' {
  export interface WhisperContext {
    transcribe(options: { filePath: string; language?: string }): Promise<{
      text: string;
    }>;
  }

  export function initWhisper(options: {
    filePath: string;
  }): Promise<WhisperContext>;
}

declare module 'whisper.rn/realtime-transcription' {
  export class RealtimeTranscriber {
    constructor(
      deps: any,
      options?: any,
      callbacks?: any,
    );
    start(): Promise<void>;
    stop(): Promise<void>;
  }
}
