import { useRef } from 'react';

// prettier-ignore
const CLOSERS = new Set([ '」', '』', '】', '〗',  '〙', '〛', '"', "'", '）', ')', ']',]);
const END_CHARS = new Set(['。', '！', '？', '.', '!', '?', '…']);

export const useTranscription = () => {
  const lastTranscription = useRef('');

  const getRequestText = (transcription: string) => {
    const newTranscription = transcription.replaceAll('[BLANK_AUDIO]', '');
    const oldChars = [...lastTranscription.current];
    const newChars = [...newTranscription];
    lastTranscription.current = newTranscription;

    const minLen = Math.min(oldChars.length, newChars.length);
    let diffIndex = -1;

    for (let i = 0; i < minLen; i++) {
      if (oldChars[i] !== newChars[i]) {
        diffIndex = i;
        break;
      }
    }

    if (diffIndex === -1) {
      if (oldChars.length === newChars.length) return '';
      diffIndex = minLen;
    }

    let start = diffIndex;
    while (start > 0 && !END_CHARS.has(newChars[start - 1])) {
      start--;
    }

    while (newChars[start] === ' ') start++;

    let end = diffIndex;
    while (end < newChars.length && !END_CHARS.has(newChars[end])) {
      end++;
    }

    if (end >= newChars.length) return '';

    end++;

    while (end < newChars.length && CLOSERS.has(newChars[end])) {
      end++;
    }

    return newChars.slice(start, end).join('').trim();
  };

  return {
    getRequestText,
  };
};
