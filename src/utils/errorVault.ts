// errorVault.ts - Storage and management for user mistakes and ETS traps
export interface WrongQuestionItem {
  id: string;
  source: 'listening' | 'reading' | 'quiz' | 'exam';
  part: number; // 1, 2, 3, 4, 5, 6, 7
  topicId: string;
  topicTitle: string;
  questionText: string;
  passage?: string;
  audioPrompt?: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  userAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanationVi: string;
  grammarRuleVi?: string;
  trapType?: string;
  timestamp: number;
  retryCount: number;
}

const ERROR_VAULT_KEY = 'dailyvocab_error_vault_v1';

export function getErrorVault(): WrongQuestionItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(ERROR_VAULT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function saveWrongQuestion(item: Omit<WrongQuestionItem, 'id' | 'timestamp' | 'retryCount'>): void {
  if (typeof window === 'undefined') return;
  const list = getErrorVault();
  
  // Deduplicate by question text
  const existingIdx = list.findIndex(q => q.questionText.trim() === item.questionText.trim());
  if (existingIdx !== -1) {
    list[existingIdx] = {
      ...list[existingIdx],
      userAnswer: item.userAnswer,
      timestamp: Date.now(),
      retryCount: (list[existingIdx].retryCount || 0) + 1,
    };
  } else {
    const newItem: WrongQuestionItem = {
      ...item,
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      retryCount: 1,
    };
    list.unshift(newItem);
  }

  try {
    localStorage.setItem(ERROR_VAULT_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('error-vault-updated'));
  } catch {}
}

export function resolveWrongQuestion(id: string): void {
  if (typeof window === 'undefined') return;
  const list = getErrorVault();
  const updated = list.filter(q => q.id !== id);
  try {
    localStorage.setItem(ERROR_VAULT_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('error-vault-updated'));
  } catch {}
}

export function clearErrorVault(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ERROR_VAULT_KEY);
    window.dispatchEvent(new CustomEvent('error-vault-updated'));
  } catch {}
}

export function getErrorVaultStats(): {
  total: number;
  bySkill: { listening: number; reading: number; exam: number };
  topTrap: string;
} {
  const list = getErrorVault();
  let listening = 0;
  let reading = 0;
  let exam = 0;
  const trapCounts: Record<string, number> = {};

  list.forEach(q => {
    if (q.source === 'listening') listening++;
    else if (q.source === 'reading') reading++;
    else exam++;

    if (q.trapType) {
      trapCounts[q.trapType] = (trapCounts[q.trapType] || 0) + 1;
    }
  });

  let topTrap = 'Bẫy chia thì & từ loại';
  let maxCount = 0;
  Object.entries(trapCounts).forEach(([trap, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topTrap = trap;
    }
  });

  return {
    total: list.length,
    bySkill: { listening, reading, exam },
    topTrap,
  };
}
