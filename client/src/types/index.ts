export interface User {
  id: string;
  email: string;
  guardianName: string;
  guardianIdType: 'AADHAAR' | 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';
  maskedId?: string;
  kycVerified: boolean;
  childName: string;
  childAge: number;
  rewardPoints: number;
  currentStreak: number;
  lastLoginDate?: string;
  preferredCategory?: string;
  secondaryCategories?: string[];
  totalLevelsCompleted?: number;
  totalXp?: number;
  unlockedStoriesCount?: number;
  premiumUnlocksCount?: number;
}

export interface UserPreferences {
  preferredCategory: string;
  secondaryCategories: string[];
}

export interface TriviaQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface ArtifactItem {
  id: string;
  title: string;
  yearOrEra: string;
  description: string;
  icon: string;
  correctOrder: number;
}

export interface ArtifactPuzzle {
  id: string;
  category: string;
  title: string;
  objective: string;
  items: ArtifactItem[];
  culturalLore: string;
  points: number;
}

export interface WordCryptItem {
  id: string;
  category: string;
  scrambled: string;
  solution: string;
  clue: string;
  phonetic: string;
  historicalFact: string;
  points: number;
}

export interface UnlockedStory {
  id: string;
  topic: string;
  chapter_number: number;
  title: string;
  content: string;
  cliffhanger_prompt: string;
  unlocked_at?: string;
  culturalContext?: string;
  teaserForNextLevel?: string;
  interactiveChoices?: string[];
}

export interface VaultModule {
  id: string;
  type: 'SPACE' | 'LAWS' | 'SCIENCE';
  title: string;
  subtitle: string;
  pointsCost: number;
  badgeAwarded: string;
  icon: string;
  accentColor: string;
  summary: string;
  learningOutcomes: string[];
  isUnlocked?: boolean;
  sections: {
    heading: string;
    content: string;
    interactiveFact?: string;
    diyActivity?: string;
  }[];
}

export interface ParentAnalytics {
  guardian: {
    name: string;
    email: string;
    idType: string;
    kycVerified: boolean;
    registrationDate: string;
  };
  child: {
    name: string;
    age: number;
    streak: number;
    rewardPoints: number;
    totalLevelsCompleted: number;
    totalXp: number;
    activeMinutesToday: number;
    accuracyPercent: number;
    storiesRead: number;
    premiumModulesUnlocked: number;
  };
  weeklyStreak: Array<{
    id: string;
    log_date: string;
    points_earned: number;
  }>;
  unlockedStories: Array<{
    id: string;
    title: string;
    topic: string;
    chapterNumber: number;
    unlockedAt: string;
  }>;
  premiumUnlocks: Array<{
    title: string;
    type: string;
    unlockedAt: string;
  }>;
  safetyAdvisory: {
    contentFilterStatus: string;
    aiSanitization: string;
    historicalViolenceFilter: string;
    screenTimeRecommended: string;
  };
}
