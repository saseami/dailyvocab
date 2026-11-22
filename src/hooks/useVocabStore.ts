import { useState, useEffect, useMemo, useCallback } from 'react';
import { Word, Topic, UserProgress, UserProfile, LearningMode, SRSItem } from '../types';
import { TOPICS, INITIAL_WORDS } from '../data/curriculum';
import { calculateSRS, updateStreak } from '../utils/srs';
import confetti from 'canvas-confetti';
import { playSound } from '../utils/audio';
import { lookupWordLocal, translateWordOnline } from '../utils/translator';

const STORAGE_KEY = 'daily_vocab_user_progress_v1';
const PROFILES_STORAGE_KEY = 'daily_vocab_user_profiles_v1';
const ACTIVE_PROFILE_KEY = 'daily_vocab_active_profile_id_v1';
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

const defaultProfile: UserProfile = {
  id: 'profile-default-saseami',
  name: 'Saseami',
  avatar: '🦁',
  targetScore: 850,
  createdAt: new Date().toISOString(),
  progress: defaultProgress,
};

export function useVocabStore() {
  // Theme state: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
  });

  // Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    if (typeof window === 'undefined') return [defaultProfile];
    try {
      const saved = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Migration from single progress
      const legacy = localStorage.getItem(STORAGE_KEY);
      if (legacy) {
        const parsedLegacy = JSON.parse(legacy);
        return [{
          ...defaultProfile,
          progress: parsedLegacy,
        }];
      }
    } catch {}
    return [defaultProfile];
  });

  // Active Profile ID
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultProfile.id;
    try {
      const saved = localStorage.getItem(ACTIVE_PROFILE_KEY);
      if (saved) return saved;
    } catch {}
    return defaultProfile.id;
  });

  // Current Active Profile
  const activeProfile = useMemo(() => {
    return profiles.find((p) => p.id === activeProfileId) || profiles[0] || defaultProfile;
  }, [profiles, activeProfileId]);

  // Progress state (synced with activeProfile.progress)
  const [progress, setProgress] = useState<UserProgress>(() => {
    return activeProfile.progress || defaultProgress;
  });

  // Navigation & view states
  const [activeDay, setActiveDay] = useState<number>(1);
  const [activeTopicId, setActiveTopicId] = useState<string>('all');
  const [activeMode, setActiveMode] = useState<LearningMode>('learn');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keep progress in sync when activeProfile changes
  useEffect(() => {
    if (activeProfile && activeProfile.progress) {
      setProgress(activeProfile.progress);
    }
  }, [activeProfileId]);

  // Persist profiles and activeProfileId whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
      localStorage.setItem(ACTIVE_PROFILE_KEY, activeProfileId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [profiles, activeProfileId, progress]);

  // Sync progress into active profile
  useEffect(() => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === activeProfileId ? { ...p, progress } : p
      )
    );
  }, [progress, activeProfileId]);

  // Auto-repair any legacy custom words saved with generic placeholder strings
  useEffect(() => {
    if (!progress.customWords || progress.customWords.length === 0) return;

    const dirtyList = progress.customWords.filter(
      (w) =>
        !w.meaningVi ||
        w.meaningVi.includes('Từ vựng trong câu') ||
        w.meaningVi === 'Từ vựng lưu từ bài học'
    );

    if (dirtyList.length === 0) return;

    let hasChanges = false;
    const repaired = progress.customWords.map((w) => {
      if (
        !w.meaningVi ||
        w.meaningVi.includes('Từ vựng trong câu') ||
        w.meaningVi === 'Từ vựng lưu từ bài học'
      ) {
        hasChanges = true;
        const local = lookupWordLocal(w.word, w.example);
        if (local) {
          return {
            ...w,
            meaningVi: local.meaningVi,
            definitionEn: local.definitionEn || w.definitionEn,
            phonetic: local.phonetic || w.phonetic,
          };
        }
      }
      return w;
    });

    if (hasChanges) {
      setProgress((prev) => ({
        ...prev,
        customWords: repaired,
      }));
    }

    // Attempt online translation for any remaining dirty words
    dirtyList.forEach((w) => {
      translateWordOnline(w.word, w.example).then((res) => {
        if (res && res.meaningVi && !res.meaningVi.includes('Từ vựng')) {
          setProgress((prev) => ({
            ...prev,
            customWords: prev.customWords.map((cw) =>
              cw.id === w.id ? { ...cw, meaningVi: res.meaningVi, phonetic: res.phonetic, definitionEn: res.definitionEn } : cw
            ),
          }));
        }
      }).catch(() => {});
    });
  }, [progress.customWords]);

  // Create new profile
  const createProfile = useCallback((name: string, avatar: string, targetScore: number) => {
    const newP: UserProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: name.trim() || 'Học Viên Mới',
      avatar: avatar || '🎯',
      targetScore: targetScore || 750,
      createdAt: new Date().toISOString(),
      progress: {
        ...defaultProgress,
        lastActiveDate: new Date().toISOString().split('T')[0],
      },
    };

    setProfiles((prev) => [...prev, newP]);
    setActiveProfileId(newP.id);
    setProgress(newP.progress);
    playSound('correct');
    return newP;
  }, []);

  // Switch profile
  const switchProfile = useCallback((profileId: string) => {
    const found = profiles.find((p) => p.id === profileId);
    if (found) {
      setActiveProfileId(profileId);
      setProgress(found.progress);
      playSound('click');
    }
  }, [profiles]);

  // Delete profile
  const deleteProfile = useCallback((profileId: string) => {
    if (profiles.length <= 1) {
      alert('Không thể xóa hồ sơ duy nhất còn lại!');
      return;
    }
    setProfiles((prev) => {
      const next = prev.filter((p) => p.id !== profileId);
      if (activeProfileId === profileId) {
        const nextActive = next[0];
        setActiveProfileId(nextActive.id);
        setProgress(nextActive.progress);
      }
      return next;
    });
    playSound('click');
  }, [profiles, activeProfileId]);

  // Update profile metadata (name, avatar, target)
  const updateProfileMeta = useCallback((profileId: string, updates: Partial<UserProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, ...updates } : p))
    );
    playSound('click');
  }, []);

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
    profiles,
    activeProfile,
    createProfile,
    switchProfile,
    deleteProfile,
    updateProfileMeta,
  };
}
