export type TabId = 'inicio' | 'recuerdos' | 'cartitas' | 'planes' | 'nosotros';

export interface CoupleProfile {
  partner1: string;
  partner2: string;
  startDate: string; // YYYY-MM-DD
  coupleCode: string;
  avatar1Url: string;
  avatar2Url: string;
  heroPhotoUrl: string;
  heroLocation: string;
}

export interface MemoryNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export type MemoryCategory =
  | 'Citas'
  | 'Viajes'
  | 'Cocina'
  | 'Días especiales'
  | 'Momentos cotidianos';

export interface MemoryItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  displayDate: string;
  category: MemoryCategory;
  description: string;
  imageUrl: string;
  washiLabel?: string;
  washiColor?: 'rose' | 'sage' | 'lavender';
  isFavorite: boolean;
  notes: MemoryNote[];
}

export type LetterStatus = 'unread' | 'read' | 'capsule' | 'draft';

export interface LetterItem {
  id: string;
  title: string;
  sender: string;
  recipient: string;
  body: string;
  dateLabel: string;
  status: LetterStatus;
  isFavorite?: boolean;
  isArchived?: boolean;
  isEmergency?: boolean;
  unlockDate?: string;
  daysRemaining?: number;
  progressPercent?: number;
  stampCode?: string;
}

export type PlanCategory =
  | 'citas'
  | 'lugares'
  | 'comidas'
  | 'peliculas'
  | 'escapadas'
  | 'suenos';

export interface PlanItem {
  id: string;
  title: string;
  category: PlanCategory;
  categoryLabel: string;
  dateLabel: string;
  notes: string;
  imageUrl?: string;
  isPriority?: boolean;
  isNext?: boolean;
  isMovieMarathon?: boolean;
  completed: boolean;
  completedDateLabel?: string;
}

export interface MilestoneItem {
  id: string;
  dateLabel: string;
  tag: string;
  icon: 'coffee' | 'heart' | 'pets' | 'key' | 'sparkles';
  title: string;
  description: string;
  imageUrl?: string;
  imageCaption?: string;
  accentColor?: 'primary' | 'secondary';
}

export interface DailyQuestion {
  id: string;
  prompt: string;
  partner1Answer: {
    author: string;
    timeAgo: string;
    text: string;
  };
  partner2Answer?: {
    author: string;
    timeAgo: string;
    text: string;
  };
}

export interface DailyThought {
  id: string;
  quote: string;
  signature: string;
  isFavorite: boolean;
}

export interface AppSettings {
  faceIdLock: boolean;
  softNotifications: boolean;
  anniversaryReminder: boolean;
  cloudSynced: boolean;
}
