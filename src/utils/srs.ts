import { SRSItem } from '../types';

export function calculateSRS(
  prevSRS: SRSItem | undefined,
  rating: 'again' | 'hard' | 'good' | 'easy'
): SRSItem {
  const now = new Date();
  const currentInterval = prevSRS ? prevSRS.interval : 0;
  let easeFactor = prevSRS ? prevSRS.easeFactor : 2.5;
  let repetition = prevSRS ? prevSRS.repetition : 0;
  let newInterval: number;

  switch (rating) {
    case 'again':
      repetition = 0;
      newInterval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;
    case 'hard':
      repetition += 1;
      newInterval = Math.max(1, Math.round(currentInterval * 1.2)) || 1;
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;
    case 'good':
      repetition += 1;
      if (repetition === 1) {
        newInterval = 1;
      } else if (repetition === 2) {
        newInterval = 3;
      } else {
        newInterval = Math.round(currentInterval * easeFactor);
      }
      break;
    case 'easy':
      repetition += 1;
      if (repetition === 1) {
        newInterval = 3;
      } else if (repetition === 2) {
        newInterval = 6;
      } else {
        newInterval = Math.round(currentInterval * easeFactor * 1.3);
      }
      easeFactor += 0.15;
      break;
  }

  const dueDate = new Date();
  dueDate.setDate(now.getDate() + newInterval);

  return {
    interval: newInterval,
    repetition,
    easeFactor: Math.min(3.0, easeFactor),
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
  };
}

export function updateStreak(lastActiveDate: string, currentStreak: number): { streak: number; todayStr: string } {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (!lastActiveDate) {
    return { streak: 1, todayStr };
  }

  if (lastActiveDate === todayStr) {
    return { streak: currentStreak, todayStr };
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastActiveDate === yesterdayStr) {
    return { streak: currentStreak + 1, todayStr };
  }

  // Broken streak
  return { streak: 1, todayStr };
}
