export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'phrasal_verb';

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  meaningVi: string;
  definitionEn: string;
  example: string;
  exampleVi: string;
  collocations?: string[];
  synonyms?: string[];
  mnemonic?: string;
  cefr: CEFRLevel;
  topicId: string;
  day: number;
  imageUrl?: string;
  audioUrl?: string;
  toeicContext?: string;
}

export interface Topic {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  icon: string;
  color: string;
  day: number;
  badge: string;
  wordCount: number;
}

export interface SRSItem {
  interval: number; // in days
  repetition: number;
  easeFactor: number;
  dueDate: string; // ISO date string
  lastReviewed: string;
}

export interface UserProgress {
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  learnedWords: string[]; // word IDs marked as learned
  masteredWords: string[]; // word IDs with >= 3 successful reviews
  bookmarkedWords: string[]; // starred word IDs
  srsMap: Record<string, SRSItem>;
  customWords: Word[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string; // Emoji avatar: 🦁, 🎯, 🚀, 👑, ⭐, 🦉, 🦊, 🏆
  targetScore: number; // 450 | 600 | 750 | 850 | 990
  createdAt: string;
  progress: UserProgress;
}

export type LearningMode = 'learn' | 'flashcard' | 'speaking' | 'writing' | 'quiz' | 'spelling' | 'match';
