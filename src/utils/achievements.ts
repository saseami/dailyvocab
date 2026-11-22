// achievements.ts - Gamification & Badge Achievement Engine
import { UserProgress } from '../types';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'skills' | 'exam' | 'speed' | 'mastery';
  unlockedAt?: string;
  progressText: string;
  isUnlocked: boolean;
}

const ACHIEVEMENTS_KEY = 'dailyvocab_achievements_v1';

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'streak_fire',
    title: 'Ngọn Lửa Bất Diệt',
    description: 'Duy trì chuỗi học tập liên tục ít nhất 7 ngày',
    icon: '🔥',
    category: 'streak',
    progressText: 'Chuỗi ngày học',
    isUnlocked: false,
  },
  {
    id: 'hunter_part12',
    title: 'Thợ Săn Bẫy ETS',
    description: 'Hoàn tất cả Part 1 tranh ảnh và Part 2 hỏi đáp nhanh',
    icon: '🦅',
    category: 'skills',
    progressText: 'Luyện nghe Part 1 & 2',
    isUnlocked: false,
  },
  {
    id: 'master_part5',
    title: 'Bậc Thầy Part 5',
    description: 'Chinh phục trọn vẹn 15 câu hỏi ngữ pháp Part 5 của một chủ đề',
    icon: '🎓',
    category: 'skills',
    progressText: '15 câu ngữ pháp Part 5',
    isUnlocked: false,
  },
  {
    id: 'native_voice',
    title: 'Giọng Chuẩn Bản Xứ',
    description: 'Đạt điểm phát âm AI từ 85% trở lên trong Speaking Lab',
    icon: '🎙️',
    category: 'skills',
    progressText: 'Phát âm AI >= 85%',
    isUnlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Tốc Độ Ánh Sáng',
    description: 'Đạt từ 300 điểm trở lên trong Mini-Game Sinh Tồn 60 Giây',
    icon: '⚡',
    category: 'speed',
    progressText: 'Điểm Sinh Tồn 60s',
    isUnlocked: false,
  },
  {
    id: 'vocab_sage',
    title: 'Nhà Thông Thái SRS',
    description: 'Thuộc lòng trên 30 từ vựng theo thuật toán Spaced Repetition',
    icon: '📚',
    category: 'mastery',
    progressText: '30+ từ thuộc lòng',
    isUnlocked: false,
  },
  {
    id: 'iron_will',
    title: 'Ý Chí Phục Thù',
    description: 'Làm lại và khắc phục thành công ít nhất 3 câu trong Sổ Tay Bẫy',
    icon: '🛡️',
    category: 'exam',
    progressText: 'Phục thù câu sai',
    isUnlocked: false,
  },
  {
    id: 'warrior_990',
    title: 'Chiến Binh 990',
    description: 'Dự đoán điểm ETS chạm ngưỡng 750+ TOEIC',
    icon: '🏆',
    category: 'exam',
    progressText: 'Điểm dự đoán ETS',
    isUnlocked: false,
  },
];

export function getAchievements(): AchievementBadge[] {
  if (typeof window === 'undefined') return INITIAL_BADGES;
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (saved) {
      const parsed: Record<string, string> = JSON.parse(saved);
      return INITIAL_BADGES.map(b => ({
        ...b,
        isUnlocked: Boolean(parsed[b.id]),
        unlockedAt: parsed[b.id] || undefined,
      }));
    }
  } catch {}
  return INITIAL_BADGES;
}

export function unlockAchievement(badgeId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
    const map: Record<string, string> = saved ? JSON.parse(saved) : {};
    if (!map[badgeId]) {
      map[badgeId] = new Date().toISOString();
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(map));
      window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { badgeId } }));
      return true;
    }
  } catch {}
  return false;
}

export function evaluateAchievements(progress: UserProgress, extra?: { speedScore?: number; estTotal?: number; revengeCount?: number }): void {
  // 1. Streak
  if (progress.streak >= 7) {
    unlockAchievement('streak_fire');
  }

  // 2. Vocab Sage
  if (progress.masteredWords.length >= 30) {
    unlockAchievement('vocab_sage');
  }

  // 3. Speed match score
  if (extra?.speedScore && extra.speedScore >= 300) {
    unlockAchievement('speed_demon');
  }

  // 4. Warrior 990
  if (extra?.estTotal && extra.estTotal >= 750) {
    unlockAchievement('warrior_990');
  }

  // 5. Iron Will
  if (extra?.revengeCount && extra.revengeCount >= 3) {
    unlockAchievement('iron_will');
  }
}
