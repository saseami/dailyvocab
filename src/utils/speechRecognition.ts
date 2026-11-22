// Web Speech API: Continuous, Pause-Tolerant Speech Recognition helper for Speaking Practice

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function cleanWord(str: string): string {
  return str.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '').trim();
}

/**
 * Enhanced phonetic and stemming matching between target word and spoken word.
 * Accommodates minor Speech-to-Text transcription discrepancies, prefixes, suffixes,
 * and common homophones.
 */
export function wordsMatch(target: string, spoken: string): boolean {
  if (!target || !spoken) return false;
  const t = cleanWord(target);
  const s = cleanWord(spoken);
  if (!t || !s) return false;
  if (t === s) return true;

  // Exact stem matching (e.g., contractual <-> contract, obligations <-> obligation, finalized <-> finalize)
  const commonSuffixes = ['s', 'es', 'ed', 'ing', 'al', 'ual', 'ly', 'tion', 'tions', 'ment', 'ments', 'ive', 'ize', 'ized'];
  for (const suf of commonSuffixes) {
    if (t.endsWith(suf) && t.slice(0, -suf.length) === s) return true;
    if (s.endsWith(suf) && s.slice(0, -suf.length) === t) return true;
  }

  // Prefix matching (e.g., covered <-> cover, contracts <-> contract, mailing <-> mail)
  if (t.startsWith(s) && t.length - s.length <= 4) return true;
  if (s.startsWith(t) && s.length - t.length <= 4) return true;

  // Common STT homophones & alternatives in business contexts
  const homophonePairs: [string, string][] = [
    ['ensure', 'insure'],
    ['in accordance with', 'according to'],
    ['coverage', 'cover'],
    ['contractual', 'contract'],
    ['warranty', 'warranties'],
    ['agreement', 'agree'],
    ['obligations', 'obligation'],
    ['management', 'manager'],
    ['officially', 'official'],
    ['finalized', 'finalised'],
    ['comprehensive', 'comprehend'],
    ['their', 'there'],
    ['to', 'two'],
    ['for', 'four'],
    ['by', 'buy']
  ];

  for (const [w1, w2] of homophonePairs) {
    if ((t === w1 && s === w2) || (t === w2 && s === w1)) return true;
  }

  // Levenshtein edit distance tolerance of 1 for words >= 4 characters
  if (t.length >= 4 && s.length >= 4 && Math.abs(t.length - s.length) <= 1) {
    let diff = 0;
    let i = 0, j = 0;
    while (i < t.length && j < s.length) {
      if (t[i] !== s[j]) {
        diff++;
        if (diff > 1) return false;
        if (t.length > s.length) { i++; continue; }
        if (s.length > t.length) { j++; continue; }
      }
      i++;
      j++;
    }
    return true;
  }

  return false;
}

export type WordPronunciationStatus = 'correct' | 'incorrect' | 'missing' | 'pending';

export interface PronunciationEvaluation {
  score: number;
  matchedCount: number;
  totalWords: number;
  wordFeedback: { word: string; status: WordPronunciationStatus }[];
}

export function calculatePronunciationScore(
  target: string,
  spoken: string,
  isLiveRecording: boolean = false
): PronunciationEvaluation {
  const rawTargetTokens = target.trim().split(/\s+/).filter(Boolean);
  const targetWords = rawTargetTokens.map(w => cleanWord(w));
  const spokenWords = spoken.trim().split(/\s+/).map(w => cleanWord(w)).filter(Boolean);

  if (targetWords.length === 0) {
    return { score: 100, matchedCount: 0, totalWords: 0, wordFeedback: [] };
  }

  if (spokenWords.length === 0) {
    return {
      score: 0,
      matchedCount: 0,
      totalWords: targetWords.length,
      wordFeedback: rawTargetTokens.map(w => ({
        word: w,
        status: isLiveRecording ? 'pending' : 'incorrect'
      })),
    };
  }

  const availableSpoken = [...spokenWords];
  let matchedCount = 0;
  const wordFeedback: { word: string; status: 'correct' | 'incorrect' | 'pending' }[] = [];

  targetWords.forEach((tw, index) => {
    const rawWord = rawTargetTokens[index] || tw;
    const matchIdx = availableSpoken.findIndex(sw => wordsMatch(tw, sw));
    if (matchIdx !== -1) {
      matchedCount++;
      wordFeedback.push({ word: rawWord, status: 'correct' });
      availableSpoken.splice(matchIdx, 1);
    } else {
      // While actively recording, unread words are 'pending' (waiting to be read) rather than failed
      wordFeedback.push({
        word: rawWord,
        status: isLiveRecording ? 'pending' : 'incorrect'
      });
    }
  });

  const rawScore = Math.round((matchedCount / targetWords.length) * 100);
  return {
    score: Math.min(100, Math.max(0, rawScore)),
    matchedCount,
    totalWords: targetWords.length,
    wordFeedback,
  };
}

/**
 * Continuous, pause-tolerant voice recognition service.
 * Resilient against browser speech engine pauses, taking breaths,
 * and natural hesitation pauses during long sentence reading.
 */
export class VoiceRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private shouldBeListening: boolean = false;
  private sessionFinalTranscript: string = '';
  private currentPassFinalTranscript: string = '';
  private restartTimeout: any = null;
  private maxDurationTimer: any = null;
  private isMobileOrSafari: boolean = false;

  constructor(
    private onResult: (result: SpeechResult) => void,
    private onError: (error: string) => void,
    private onEnd: () => void
  ) {
    if (typeof window !== 'undefined') {
      this.isMobileOrSafari = typeof navigator !== 'undefined' && (
        /iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent || '')
      );

      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          // iOS Safari breaks or crashes if continuous is true
          this.recognition.continuous = !this.isMobileOrSafari;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';

          this.recognition.onresult = (event: any) => {
            let currentPassFinal = '';
            let interimTranscript = '';
            let confidence = 0.95;

            for (let i = 0; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                currentPassFinal += res[0].transcript + ' ';
                confidence = res[0].confidence || 0.95;
              } else {
                interimTranscript += res[0].transcript;
              }
            }

            this.currentPassFinalTranscript = currentPassFinal.trim();

            const fullAccumulated = [
              this.sessionFinalTranscript,
              this.currentPassFinalTranscript,
              interimTranscript.trim()
            ]
              .filter(Boolean)
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();

            this.onResult({
              transcript: fullAccumulated,
              confidence,
              isFinal: false,
            });
          };

          this.recognition.onerror = (event: any) => {
            // 'no-speech' or 'aborted' happens naturally when user takes a breath
            if (event.error === 'no-speech') {
              if (this.isMobileOrSafari) {
                this.stop();
              }
              return;
            }
            if (event.error === 'aborted') {
              this.isListening = false;
              this.shouldBeListening = false;
              this.onEnd();
              return;
            }

            // Fatal errors
            this.shouldBeListening = false;
            this.isListening = false;
            const msg =
              event.error === 'not-allowed'
                ? 'Quyền truy cập Microphone bị từ chối. Vui lòng kiểm tra quyền micro trong Cài đặt Safari/iOS.'
                : event.error === 'audio-capture'
                ? 'Không tìm thấy thiết bị Microphone trên thiết bị.'
                : `Lỗi nhận diện giọng nói: ${event.error}`;
            this.onError(msg);
            this.onEnd();
          };

          this.recognition.onend = () => {
            this.isListening = false;

            if (this.currentPassFinalTranscript) {
              this.sessionFinalTranscript = [
                this.sessionFinalTranscript,
                this.currentPassFinalTranscript
              ]
                .filter(Boolean)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();
              this.currentPassFinalTranscript = '';
            }

            // On iOS/Safari, avoid automated restart loops which get blocked by user-gesture security
            if (this.shouldBeListening && !this.isMobileOrSafari) {
              if (this.restartTimeout) clearTimeout(this.restartTimeout);
              this.restartTimeout = setTimeout(() => {
                if (this.shouldBeListening) {
                  try {
                    this.recognition?.start();
                    this.isListening = true;
                  } catch {
                    this.isListening = false;
                    this.shouldBeListening = false;
                    this.onEnd();
                  }
                }
              }, 150);
            } else {
              this.shouldBeListening = false;
              this.onEnd();
            }
          };
        } catch (e: any) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }
    }
  }

  public start(): boolean {
    if (!this.recognition) {
      this.onError('Trình duyệt chưa hỗ trợ Web Speech Recognition hoặc đang bị chặn quyền.');
      return false;
    }

    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }

    this.shouldBeListening = true;
    this.sessionFinalTranscript = '';
    this.currentPassFinalTranscript = '';

    // Safety watchdog: Max 45 seconds per speaking attempt
    this.maxDurationTimer = setTimeout(() => {
      if (this.isListening) {
        this.stop();
      }
    }, 45000);

    if (this.isListening) return true;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      if (err?.name === 'InvalidStateError') {
        this.isListening = true;
        return true;
      }
      this.isListening = false;
      this.shouldBeListening = false;
      this.onError('Không thể mở micro: ' + (err?.message || 'Vui lòng kiểm tra quyền truy cập'));
      return false;
    }
  }

  public stop(): void {
    this.shouldBeListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.maxDurationTimer) {
      clearTimeout(this.maxDurationTimer);
      this.maxDurationTimer = null;
    }

    if (this.currentPassFinalTranscript) {
      this.sessionFinalTranscript = [
        this.sessionFinalTranscript,
        this.currentPassFinalTranscript
      ]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      this.currentPassFinalTranscript = '';
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      try {
        this.recognition.abort();
      } catch {}
    }
    this.isListening = false;

    this.onResult({
      transcript: this.sessionFinalTranscript.trim(),
      confidence: 0.95,
      isFinal: true
    });

    this.onEnd();
  }

  public reset(): void {
    this.sessionFinalTranscript = '';
    this.currentPassFinalTranscript = '';
  }

  public active(): boolean {
    return this.shouldBeListening || this.isListening;
  }
}
