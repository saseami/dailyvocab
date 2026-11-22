import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word, Topic, UserProgress, LearningMode, SRSItem } from '../types';
import { TOPICS, INITIAL_WORDS } from '../data/curriculum';
import { calculateSRS, updateStreak } from '../utils/srs';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';

const STORAGE_KEY = 'daily_vocab_user_progress_v1';
const THEME_KEY = 'color-scheme';

const defaultProgress: UserProgress = {
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  learnedWords: [],
  masteredWords: [],
  bookmarkedWords: [],
  srsMap: {},
  customWords: [],
};

export function useVocabStore() {
  // Theme state: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
  });

  // Progress state
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window === 'undefined') return defaultProgress;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return defaultProgress;
  });

  // Navigation & view states
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeTopicId, setActiveTopicId] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<LearningMode>('learn');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Sync theme changes with DOM and modern-web-guidance rules
  useEffect(() => {
    const meta = document.querySelector('meta[name="color-scheme"]');
    const root = document.documentElement;

    if (theme === 'system') {
      localStorage.removeItem(THEME_KEY);
      if (meta) meta.setAttribute('content', 'light dark');
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      localStorage.setItem(THEME_KEY, theme);
      if (meta) meta.setAttribute('content', theme);
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // All combined words (pre-built + custom)
  const allWords = useMemo(() => {
    return [...INITIAL_WORDS, ...progress.customWords];
  }, [progress.customWords]);

  // Filter words by active day or topic
  const currentWords = useMemo(() => {
    return allWords.filter(word => {
      const matchesDay = activeTopicId === 'all' ? word.day === activeDay : true;
      const matchesTopic = activeTopicId === 'all' ? true : word.topicId === activeTopicId;
      const matchesSearch = searchQuery.trim() === ''
        ? true
        : word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.meaningVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          word.definitionEn.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDay && matchesTopic && matchesSearch;
    });
  }, [allWords, activeDay, activeTopicId, searchQuery]);

  // Toggle bookmark / star
  const toggleBookmark = useCallback((wordId: string) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedWords.includes(wordId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarkedWords.filter(id => id !== wordId)
        : [...prev.bookmarkedWords, wordId];
      playSound('click');
      return {
        ...prev,
        bookmarkedWords: nextBookmarks,
      };
    });
  }, []);

  // Mark word learned / review with SRS
  const reviewWord = useCallback((wordId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setProgress(prev => {
      const prevSRS = prev.srsMap[wordId];
      const newSRS = calculateSRS(prevSRS, rating);
      const isLearned = prev.learnedWords.includes(wordId);
      const learnedWords = isLearned ? prev.learnedWords : [...prev.learnedWords, wordId];
      
      let masteredWords = prev.masteredWords;
      if (newSRS.repetition >= 3 && !masteredWords.includes(wordId)) {
        masteredWords = [...masteredWords, wordId];
      } else if (newSRS.repetition < 2 && masteredWords.includes(wordId)) {
        masteredWords = masteredWords.filter(id => id !== wordId);
      }

      const { streak, todayStr } = updateStreak(prev.lastActiveDate, prev.streak);

      return {
        ...prev,
        streak,
        lastActiveDate: todayStr,
        learnedWords,
        masteredWords,
        srsMap: {
          ...prev.srsMap,
          [wordId]: newSRS,
        },
      };
    });
  }, []);

  // Add custom word
  const addCustomWord = useCallback((newWordData: Omit<Word, 'id'>) => {
    const newWord: Word = {
      ...newWordData,
      id: `custom-${Date.now()}`,
    };
    setProgress(prev => ({
      ...prev,
      customWords: [newWord, ...prev.customWords],
    }));
    playSound('correct');
  }, []);

  // Delete custom word
  const deleteCustomWord = useCallback((wordId: string) => {
    setProgress(prev => ({
      ...prev,
      customWords: prev.customWords.filter(w => w.id !== wordId),
      learnedWords: prev.learnedWords.filter(id => id !== wordId),
      masteredWords: prev.masteredWords.filter(id => id !== wordId),
      bookmarkedWords: prev.bookmarkedWords.filter(id => id !== wordId),
    }));
  }, []);

  // Trigger celebration confetti
  const triggerCelebration = useCallback(() => {
    playSound('complete');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  // Reset or import progress
  const importProgress = useCallback((data: UserProgress) => {
    setProgress(data);
    playSound('complete');
  }, []);

  return {
    theme,
    setTheme,
    progress,
    activeDay,
    setActiveDay,
    activeTopicId,
    setActiveTopicId,
    activeMode,
    setActiveMode,
    searchQuery,
    setSearchQuery,
    topics: TOPICS,
    allWords,
    currentWords,
    toggleBookmark,
    reviewWord,
    addCustomWord,
    deleteCustomWord,
    triggerCelebration,
    importProgress,
  };
}
