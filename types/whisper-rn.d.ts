declare module 'whisper.rn' {
  export const initWhisper: any;
  export const initWhisperVad: any;
  export const releaseAllWhisper: any;
  export const releaseAllWhisperVad: any;
}

declare module 'whisper.rn/src/realtime-transcription' {
  export const RealtimeTranscriber: any;
  export const RingBufferVad: any;
  export const VAD_PRESETS: any;
}

declare module 'whisper.rn/src/realtime-transcription/adapters/AudioPcmStreamAdapter' {
  export const AudioPcmStreamAdapter: any;
}
