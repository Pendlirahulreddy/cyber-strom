export interface LearningModule {
  title: string;
  description: string;
  duration: string;
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface LearningPath {
  title: string;
  overview: string;
  modules: LearningModule[];
  projects: {
    title: string;
    description: string;
  }[];
  resources: {
    name: string;
    type: string;
    url?: string;
  }[];
}

export interface UserInput {
  goal: string;
  currentLevel: string;
  learningStyle: string;
  timeCommitment: string;
}
