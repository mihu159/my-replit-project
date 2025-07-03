export interface PostureAnalysis {
  shoulderAlignment: number;
  neckPosition: number;
  spineAlignment: number;
  overallScore: number;
  feedback: string;
  status: 'good' | 'warning' | 'error';
}

export interface CameraState {
  isActive: boolean;
  isInitializing: boolean;
  error: string | null;
  stream: MediaStream | null;
}

export interface ExerciseWithDetails {
  id: number;
  exerciseId: number;
  userId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'skipped';
  startTime: Date | null;
  endTime: Date | null;
  notes: string | null;
  createdAt: Date;
  exercise: {
    id: number;
    name: string;
    description: string | null;
    duration: number | null;
    difficulty: string;
    category: string;
    instructions: string | null;
    videoUrl: string | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
  };
}

export interface UserStats {
  weeklyProgress: number;
  sessionsToday: number;
  streakDays: number;
  totalCorrections: number;
}

export interface FeedbackItem {
  id: number;
  userId: string;
  sessionId: number | null;
  type: 'correction' | 'achievement' | 'tip';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
}
