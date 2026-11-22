// sessionPersistence.ts - Persistent Auto-Save for Learning Progress & Question State
// Prevents loss of progress when users switch apps, refresh the browser, or close the tab

export interface SavedReadingSession {
  topicId: string;
  selectedPart: number;
  currentIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  completedParts: number[];
  timestamp: number;
}

export interface SavedListeningSession {
  topicId: string;
  selectedPart: number;
  currentIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  completedParts: number[];
  timestamp: number;
}

export interface SavedExamSession {
  examId: string;
  isTestStarted: boolean;
  secondsRemaining: number;
  currentQIndex: number;
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  swAnswers: Record<number, { text: string; score?: number; transcript?: string }>;
  isOMROpen: boolean;
  savedAt: number;
}

export interface SavedTopicWorkspaceState {
  activeSkillTab: 'vocab' | 'listening' | 'reading' | 'speaking_writing';
  activeSession: number;
  vocabStep: 'flashcard' | 'match' | 'quiz' | 'spelling' | 'list';
  timestamp: number;
}

const READING_SESSION_PREFIX = 'dailyvocab_reading_session_';
const LISTENING_SESSION_PREFIX = 'dailyvocab_listening_session_';
const WORKSPACE_STATE_PREFIX = 'dailyvocab_workspace_state_';
const EXAM_SESSION_KEY = 'dailyvocab_active_exam_session_v1';
const APP_NAV_KEY = 'dailyvocab_app_navigation_v1';

// ============================================================================
// 1. READING SESSION PERSISTENCE
// ============================================================================

export function getReadingSession(topicId: string, part: number): SavedReadingSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${READING_SESSION_PREFIX}${topicId}_part_${part}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: SavedReadingSession = JSON.parse(raw);
      // Valid for 7 days
      if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function saveReadingSession(
  topicId: string,
  part: number,
  currentIndex: number,
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>,
  completedParts: number[] = []
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${READING_SESSION_PREFIX}${topicId}_part_${part}`;
    const session: SavedReadingSession = {
      topicId,
      selectedPart: part,
      currentIndex,
      userAnswers,
      completedParts,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(session));
  } catch {}
}

export function clearReadingSession(topicId: string, part: number): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${READING_SESSION_PREFIX}${topicId}_part_${part}`;
    localStorage.removeItem(key);
  } catch {}
}

// ============================================================================
// 2. LISTENING SESSION PERSISTENCE
// ============================================================================

export function getListeningSession(topicId: string, part: number): SavedListeningSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = `${LISTENING_SESSION_PREFIX}${topicId}_part_${part}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed: SavedListeningSession = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function saveListeningSession(
  topicId: string,
  part: number,
  currentIndex: number,
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>,
  completedParts: number[] = []
): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${LISTENING_SESSION_PREFIX}${topicId}_part_${part}`;
    const session: SavedListeningSession = {
      topicId,
      selectedPart: part,
      currentIndex,
      userAnswers,
      completedParts,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(session));
  } catch {}
}

export function clearListeningSession(topicId: string, part: number): void {
  if (typeof window === 'undefined') return;
  try {
    const key = `${LISTENING_SESSION_PREFIX}${topicId}_part_${part}`;
    localStorage.removeItem(key);
  } catch {}
}

// ============================================================================
// 3. TOPIC WORKSPACE STATE (SKILL TAB & SESSION STEP)
// ============================================================================

export function getTopicWorkspaceState(topicId: string): SavedTopicWorkspaceState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${WORKSPACE_STATE_PREFIX}${topicId}`);
    if (raw) {
      const parsed: SavedTopicWorkspaceState = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function saveTopicWorkspaceState(
  topicId: string,
  state: {
    activeSkillTab: 'vocab' | 'listening' | 'reading' | 'speaking_writing';
    activeSession: number;
    vocabStep: 'flashcard' | 'match' | 'quiz' | 'spelling' | 'list';
  }
): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: SavedTopicWorkspaceState = {
      ...state,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${WORKSPACE_STATE_PREFIX}${topicId}`, JSON.stringify(payload));
  } catch {}
}

// ============================================================================
// 4. EXAM SIMULATOR PERSISTENCE
// ============================================================================

export function getActiveExamSession(): SavedExamSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(EXAM_SESSION_KEY);
    if (raw) {
      const parsed: SavedExamSession = JSON.parse(raw);
      // Valid if saved within the last 4 hours
      if (Date.now() - parsed.savedAt < 4 * 60 * 60 * 1000 && parsed.isTestStarted) {
        // Adjust remaining seconds by elapsed time
        const elapsedSecs = Math.floor((Date.now() - parsed.savedAt) / 1000);
        const adjustedRemaining = Math.max(0, parsed.secondsRemaining - elapsedSecs);
        return {
          ...parsed,
          secondsRemaining: adjustedRemaining,
        };
      }
    }
  } catch {}
  return null;
}

export function saveActiveExamSession(session: Omit<SavedExamSession, 'savedAt'>): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: SavedExamSession = {
      ...session,
      savedAt: Date.now(),
    };
    localStorage.setItem(EXAM_SESSION_KEY, JSON.stringify(payload));
  } catch {}
}

export function clearActiveExamSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(EXAM_SESSION_KEY);
  } catch {}
}

// ============================================================================
// 5. GLOBAL APP NAVIGATION STATE
// ============================================================================

export function getAppNavigationState(): {
  selectedTopicId?: string;
  mobileTab?: 'study' | 'notebook' | 'exam' | 'profile';
  currentPhase?: 'foundation' | 'acceleration' | 'mock_exam';
} | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(APP_NAV_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveAppNavigationState(state: {
  selectedTopicId?: string;
  mobileTab?: 'study' | 'notebook' | 'exam' | 'profile';
  currentPhase?: 'foundation' | 'acceleration' | 'mock_exam';
}): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getAppNavigationState() || {};
    localStorage.setItem(APP_NAV_KEY, JSON.stringify({ ...existing, ...state }));
  } catch {}
}
