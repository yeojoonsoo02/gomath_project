import { z } from 'zod';
import { DifficultySchema, CategorySchema } from './problem';

// 사용자 역할
export const UserRoleSchema = z.enum(['student', 'teacher', 'admin']);
export type UserRole = z.infer<typeof UserRoleSchema>;

// 학습 레벨
export const LearningLevelSchema = z.enum([
  'beginner',     // 초급
  'intermediate', // 중급
  'advanced',     // 고급
  'expert'        // 전문가
]);
export type LearningLevel = z.infer<typeof LearningLevelSchema>;

// 사용자 프로필
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  displayName: z.string(),
  avatar: z.string().url().optional(),
  
  // 기본 정보
  role: UserRoleSchema.default('student'),
  level: LearningLevelSchema.default('beginner'),
  grade: z.number().min(1).max(12).optional(), // 학년
  school: z.string().optional(),
  
  // 학습 선호도
  preferredCategories: z.array(CategorySchema).default([]),
  preferredDifficulty: DifficultySchema.default('medium'),
  learningGoals: z.array(z.string()).default([]),
  
  // 설정
  settings: z.object({
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    visualHintsEnabled: z.boolean().default(true),
    language: z.string().default('ko'),
    theme: z.enum(['light', 'dark', 'system']).default('system')
  }).default({}),
  
  // 상태
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  lastLoginAt: z.date().optional(),
  
  // 타임스탬프
  createdAt: z.date(),
  updatedAt: z.date()
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

// 학습 진도
export const LearningProgressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: CategorySchema,
  
  // 진도 정보
  totalProblems: z.number().default(0),
  solvedProblems: z.number().default(0),
  correctAnswers: z.number().default(0),
  accuracyRate: z.number().min(0).max(100).default(0),
  
  // 난이도별 진도
  progressByDifficulty: z.object({
    easy: z.object({
      solved: z.number().default(0),
      correct: z.number().default(0),
      total: z.number().default(0)
    }).default({}),
    medium: z.object({
      solved: z.number().default(0),
      correct: z.number().default(0),
      total: z.number().default(0)
    }).default({}),
    hard: z.object({
      solved: z.number().default(0),
      correct: z.number().default(0),
      total: z.number().default(0)
    }).default({})
  }).default({}),
  
  // 시간 정보
  totalStudyTime: z.number().default(0), // 분 단위
  averageTimePerProblem: z.number().default(0), // 분 단위
  
  // 최근 활동
  lastActivityAt: z.date().optional(),
  currentStreak: z.number().default(0), // 연속 학습일
  longestStreak: z.number().default(0),
  
  // 타임스탬프
  createdAt: z.date(),
  updatedAt: z.date()
});
export type LearningProgress = z.infer<typeof LearningProgressSchema>;

// 문제 풀이 기록
export const ProblemAttemptSchema = z.object({
  id: z.string(),
  userId: z.string(),
  problemId: z.string(),
  
  // 답안 정보
  userAnswer: z.string(),
  isCorrect: z.boolean(),
  timeSpent: z.number(), // 초 단위
  attemptsCount: z.number().default(1),
  
  // 힌트 사용 정보
  hintsUsed: z.array(z.string()).default([]), // 사용한 힌트 ID들
  visualHintsViewed: z.array(z.string()).default([]),
  
  // 상태
  status: z.enum(['in_progress', 'completed', 'abandoned']).default('completed'),
  difficulty: DifficultySchema,
  
  // 메타데이터
  deviceType: z.enum(['web', 'mobile']).optional(),
  sessionId: z.string().optional(),
  
  // 타임스탬프
  createdAt: z.date(),
  updatedAt: z.date()
});
export type ProblemAttempt = z.infer<typeof ProblemAttemptSchema>;

// 사용자 성취도
export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(['problem_solving', 'streak', 'accuracy', 'time', 'special']),
  
  // 달성 조건
  criteria: z.object({
    type: z.enum(['count', 'percentage', 'streak', 'time']),
    target: z.number(),
    category: CategorySchema.optional(),
    difficulty: DifficultySchema.optional()
  }),
  
  // 보상
  points: z.number().default(0),
  badge: z.string().optional(),
  
  // 상태
  isActive: z.boolean().default(true),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']).default('common'),
  
  createdAt: z.date()
});
export type Achievement = z.infer<typeof AchievementSchema>;

// 사용자 성취도 기록
export const UserAchievementSchema = z.object({
  id: z.string(),
  userId: z.string(),
  achievementId: z.string(),
  achievement: AchievementSchema,
  
  // 진도
  currentProgress: z.number().default(0),
  targetProgress: z.number(),
  isCompleted: z.boolean().default(false),
  completedAt: z.date().optional(),
  
  createdAt: z.date(),
  updatedAt: z.date()
});
export type UserAchievement = z.infer<typeof UserAchievementSchema>;

// 북마크된 문제
export const BookmarkedProblemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  problemId: z.string(),
  
  // 추가 정보
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
  
  createdAt: z.date()
});
export type BookmarkedProblem = z.infer<typeof BookmarkedProblemSchema>;