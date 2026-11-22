// Utility for tracking and calculating topic completion across all 4 TOEIC skills:
// 1. Vocabulary & Fluency (25%)
// 2. Listening Comprehension (25%)
// 3. Reading Comprehension (25%)
// 4. Speaking & Writing (25%)

const TOPIC_SKILLS_STORAGE_KEY = 'toeic_topic_completed_skills_v1';

export interface TopicSkillsCompletion {
  vocab?: boolean;
  listening?: boolean;
  reading?: boolean;
  speaking_writing?: boolean;
}

export type TopicProgressMap = Record<string, TopicSkillsCompletion>;

export function getTopicSkillsProgressMap(): TopicProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(TOPIC_SKILLS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

export function saveTopicSkillCompleted(topicId: string, skill: keyof TopicSkillsCompletion): TopicSkillsCompletion {
  const map = getTopicSkillsProgressMap();
  const current = map[topicId] || {};
  const updated: TopicSkillsCompletion = {
    ...current,
    [skill]: true,
  };
  map[topicId] = updated;

  try {
    localStorage.setItem(TOPIC_SKILLS_STORAGE_KEY, JSON.stringify(map));
  } catch {}

  return updated;
}

export function calculateTopicOverallProgress(topicId: string): {
  percent: number;
  completedSkillsCount: number;
  isAllCompleted: boolean;
  skills: TopicSkillsCompletion;
} {
  const map = getTopicSkillsProgressMap();
  const skills = map[topicId] || {};
  
  const completedSkillsCount = [
    skills.vocab,
    skills.listening,
    skills.reading,
    skills.speaking_writing,
  ].filter(Boolean).length;

  const percent = Math.round((completedSkillsCount / 4) * 100);
  const isAllCompleted = completedSkillsCount === 4;

  return {
    percent,
    completedSkillsCount,
    isAllCompleted,
    skills,
  };
}
