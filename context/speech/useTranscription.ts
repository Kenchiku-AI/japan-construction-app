import { useRef } from 'react';

// prettier-ignore
const END_CHARS = new Set(['。', '！', '？', '.', '!', '?', '…']);

export const useTranscription = () => {
  const committedTextRef = useRef('');
  const chunkCountsRef = useRef<Map<string, number>>(new Map());
  const committedChunkSetRef = useRef<Set<string>>(new Set());

  const getRequestText = (transcription: string) => {
    const cleaned = transcription
      .replaceAll('[BLANK_AUDIO]', '')
      .replace(/\s+/g, ' ')
      .trim();

    const chunks: string[] = [];
    let current = '';

    for (const char of cleaned) {
      current += char;
      if (END_CHARS.has(char)) {
        chunks.push(current.trim());
        current = '';
      }
    }

    if (chunks.length === 0) return '';

    const lastChunk = chunks[chunks.length - 1];

    if (committedChunkSetRef.current.has(lastChunk)) return '';

    const counts = chunkCountsRef.current;
    const newCount = (counts.get(lastChunk) ?? 0) + 1;
    counts.set(lastChunk, newCount);

    if (newCount >= 3) {
      const fullStableText = chunks.join(' ');
      committedTextRef.current = fullStableText;
      committedChunkSetRef.current.add(lastChunk);
      counts.delete(lastChunk);

      return fullStableText;
    }

    return '';
  };

  const clearTranscription = () => {
    committedTextRef.current = '';
    chunkCountsRef.current = new Map();
    committedChunkSetRef.current = new Set();
  };

  return {
    getRequestText,
    clearTranscription,
  };
};
