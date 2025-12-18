export type IsoDateString = string;

export interface Topic {
  id: string;
  title: string;
  description: string;
  addedAt: IsoDateString;
  currentCycle: number;
  nextReview: IsoDateString;
  completedCycles: IsoDateString[];
}

