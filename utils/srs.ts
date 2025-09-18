
import { Item } from '../types';

export enum SrsGrade {
  AGAIN = 0,
  HARD = 3,
  GOOD = 4,
  EASY = 5,
}

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function updateSrsItem(item: Item, grade: SrsGrade): Item {
  let { srsLevel = 0, nextReview = 0 } = item;
  let newInterval: number;

  if (grade < SrsGrade.GOOD) {
    srsLevel = 0;
    newInterval = 1 * MINUTE;
  } else {
    if (srsLevel === 0) {
      newInterval = 1 * MINUTE;
    } else if (srsLevel === 1) {
      newInterval = 10 * MINUTE;
    } else if (srsLevel === 2) {
      newInterval = 1 * DAY;
    } else {
      const lastInterval = (nextReview - (item.nextReview || Date.now())) / DAY; // Simplified
      newInterval = Math.ceil(lastInterval * 2.5) * DAY;
    }
    
    if (grade === SrsGrade.HARD) {
      newInterval *= 0.8;
    }
    if (grade === SrsGrade.EASY) {
      newInterval *= 1.2;
    }

    srsLevel += 1;
  }

  return {
    ...item,
    srsLevel,
    nextReview: Date.now() + newInterval,
  };
}

export function getNextSrsItem(items: Item[]): Item | null {
  const now = Date.now();
  const dueItems = items
    .filter(item => (item.nextReview || 0) <= now)
    .sort((a, b) => (a.srsLevel || 0) - (b.srsLevel || 0));

  return dueItems.length > 0 ? dueItems[0] : null;
}
