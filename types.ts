
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  activities: string[];
  resources: { name: string; url: string; type: 'video' | 'article' | 'quiz' | 'tool' }[];
  project: {
    title: string;
    description: string;
  };
  status?: 'not-started' | 'in-progress' | 'completed';
}

export interface LearningPath {
  topic: string;
  summary: string;
  totalEstimatedWeeks: string;
  modules: LearningModule[];
  outcomes: string[];
  prerequisites: string[];
}

export interface UserProfile {
  name: string;
  goal: string;
  ageGroup: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  interests: string[];
  availableHoursPerWeek: number;
  learningStyle: 'Visual' | 'Auditory' | 'Reading/Writing' | 'Kinesthetic';
  priorKnowledge: string;
}
