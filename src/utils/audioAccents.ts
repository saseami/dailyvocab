// audioAccents.ts - ETS 4-Accents (US, UK, AUS, CA) and Voice Synthesis Engine
export type TOEICAccent = 'US' | 'UK' | 'AU' | 'CA' | 'RANDOM';

const ACCENT_STORAGE_KEY = 'dailyvocab_voice_accent_v1';

export const ETS_ACCENTS: { id: TOEICAccent; label: string; flag: string; desc: string }[] = [
  { id: 'RANDOM', label: 'Ngẫu nhiên ETS', flag: '🎲', desc: 'Luân phiên 4 giọng như phòng thi thật' },
  { id: 'US', label: 'Giọng Mỹ (US)', flag: '🇺🇸', desc: 'Tiếng Anh - Mỹ chuẩn ETS' },
  { id: 'UK', label: 'Giọng Anh (UK)', flag: '🇬🇧', desc: 'Tiếng Anh - Anh chuẩn BBC/Oxford' },
  { id: 'AU', label: 'Giọng Úc (AUS)', flag: '🇦🇺', desc: 'Tiếng Anh - Úc nối âm và nhả chữ nhanh' },
  { id: 'CA', label: 'Giọng Canada (CA)', flag: '🇨🇦', desc: 'Tiếng Anh - Canada trầm và dứt khoát' },
];

export function getPreferredAccent(): TOEICAccent {
  if (typeof window === 'undefined') return 'RANDOM';
  try {
    const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as TOEICAccent;
    if (saved && ['US', 'UK', 'AU', 'CA', 'RANDOM'].includes(saved)) {
      return saved;
    }
  } catch {}
  return 'RANDOM';
}

export function setPreferredAccent(accent: TOEICAccent): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    window.dispatchEvent(new CustomEvent('accent-changed', { detail: { accent } }));
  } catch {}
}

export function resolveEffectiveAccent(preferred: TOEICAccent = getPreferredAccent()): 'US' | 'UK' | 'AU' | 'CA' {
  if (preferred !== 'RANDOM') return preferred;
  const list: ('US' | 'UK' | 'AU' | 'CA')[] = ['US', 'UK', 'AU', 'CA'];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}

export function getVoiceForAccent(accent: 'US' | 'UK' | 'AU' | 'CA'): { voice: SpeechSynthesisVoice | null; langCode: string } {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return { voice: null, langCode: 'en-US' };
  }

  const langCodeMap: Record<'US' | 'UK' | 'AU' | 'CA', string> = {
    US: 'en-US',
    UK: 'en-GB',
    AU: 'en-AU',
    CA: 'en-CA',
  };

  const targetLang = langCodeMap[accent];
  const voices = window.speechSynthesis.getVoices();

  // Find exact matching lang
  const matchingVoices = voices.filter(v => v.lang.toLowerCase() === targetLang.toLowerCase());
  if (matchingVoices.length > 0) {
    // Prefer natural / google voices if present
    const best = matchingVoices.find(v => 
      v.name.includes('Natural') || 
      v.name.includes('Google') || 
      v.name.includes('Premium') ||
      v.name.includes('Daniel') ||
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Catherine') ||
      v.name.includes('Linda')
    ) || matchingVoices[0];
    return { voice: best, langCode: targetLang };
  }

  // Fallback to any voice with prefix
  const prefix = targetLang.substring(0, 2);
  const fallback = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
  return { voice: fallback || null, langCode: targetLang };
}

export function speakWithETSAccent(
  text: string,
  accent?: TOEICAccent,
  rate: number = 0.95,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const effective = resolveEffectiveAccent(accent || getPreferredAccent());
    const { voice, langCode } = getVoiceForAccent(effective);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.lang = langCode;
    if (voice) {
      utterance.voice = voice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
  }
}
