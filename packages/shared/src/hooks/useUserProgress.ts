import { useState, useCallback, useEffect } from 'react';
import { 
  LearningProgress, 
  UserAchievement, 
  ProblemAttempt,
  Category,
  Difficulty 
} from '../types/user';

interface UserProgressState {
  progress: LearningProgress[];
  achievements: UserAchievement[];
  recentAttempts: ProblemAttempt[];
  loading: boolean;
  error: string | null;
}

interface ProgressSummary {
  totalProblems: number;
  solvedProblems: number;
  accuracyRate: number;
  totalStudyTime: number;
  currentStreak: number;
  longestStreak: number;
  recentActivityDays: number[];
}

/**
 * 사용자 학습 진도를 관리하는 커스텀 훅
 * 웹과 모바일에서 공통으로 사용
 */
export function useUserProgress(userId?: string) {
  const [state, setState] = useState<UserProgressState>({
    progress: [],
    achievements: [],
    recentAttempts: [],
    loading: false,
    error: null
  });
  
  // 사용자 진도 데이터 로드
  const loadProgress = useCallback(async (forceRefresh = false) => {
    if (!userId) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: 실제 API 호출 구현
      // const [progress, achievements, attempts] = await Promise.all([
      //   progressApi.getProgress(userId),
      //   achievementApi.getUserAchievements(userId),
      //   attemptApi.getRecentAttempts(userId)
      // ]);
      
      // 임시 Mock 데이터
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockProgress = generateMockProgress();
      const mockAchievements = generateMockAchievements();
      const mockAttempts = generateMockAttempts();
      
      setState(prev => ({
        ...prev,
        progress: mockProgress,
        achievements: mockAchievements,
        recentAttempts: mockAttempts,
        loading: false
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '진도 로드 중 오류가 발생했습니다.',
        loading: false
      }));
    }
  }, [userId]);
  
  // 문제 풀이 기록 추가
  const recordAttempt = useCallback(async (attempt: Omit<ProblemAttempt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: 실제 API 호출 구현
      // const newAttempt = await attemptApi.createAttempt(attempt);
      
      const newAttempt: ProblemAttempt = {
        ...attempt,
        id: `attempt_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setState(prev => ({
        ...prev,
        recentAttempts: [newAttempt, ...prev.recentAttempts.slice(0, 9)] // 최근 10개만 유지
      }));
      
      // 진도 업데이트
      await loadProgress(true);
      
      return newAttempt;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '풀이 기록 저장 중 오류가 발생했습니다.');
    }
  }, [loadProgress]);
  
  // 카테고리별 진도 가져오기
  const getProgressByCategory = useCallback((category: Category): LearningProgress | undefined => {
    return state.progress.find(p => p.category === category);
  }, [state.progress]);
  
  // 전체 진도 요약
  const getProgressSummary = useCallback((): ProgressSummary => {
    const totalProblems = state.progress.reduce((sum, p) => sum + p.totalProblems, 0);
    const solvedProblems = state.progress.reduce((sum, p) => sum + p.solvedProblems, 0);
    const correctAnswers = state.progress.reduce((sum, p) => sum + p.correctAnswers, 0);
    const totalStudyTime = state.progress.reduce((sum, p) => sum + p.totalStudyTime, 0);
    
    const accuracyRate = solvedProblems > 0 ? (correctAnswers / solvedProblems) * 100 : 0;
    const currentStreak = Math.max(...state.progress.map(p => p.currentStreak), 0);
    const longestStreak = Math.max(...state.progress.map(p => p.longestStreak), 0);
    
    // 최근 30일 활동 데이터 (Mock)
    const recentActivityDays = Array.from({ length: 30 }, (_, i) => 
      Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0
    );
    
    return {
      totalProblems,
      solvedProblems,
      accuracyRate,
      totalStudyTime,
      currentStreak,
      longestStreak,
      recentActivityDays
    };
  }, [state.progress]);
  
  // 완료된 성취도 필터링
  const getCompletedAchievements = useCallback(() => {
    return state.achievements.filter(a => a.isCompleted);
  }, [state.achievements]);
  
  // 진행 중인 성취도 필터링
  const getInProgressAchievements = useCallback(() => {
    return state.achievements
      .filter(a => !a.isCompleted)
      .sort((a, b) => (b.currentProgress / b.targetProgress) - (a.currentProgress / a.targetProgress));
  }, [state.achievements]);
  
  // 난이도별 통계
  const getStatsByDifficulty = useCallback((difficulty: Difficulty) => {
    const stats = { solved: 0, correct: 0, total: 0 };
    
    state.progress.forEach(p => {
      const diffStats = p.progressByDifficulty[difficulty];
      stats.solved += diffStats.solved;
      stats.correct += diffStats.correct;
      stats.total += diffStats.total;
    });
    
    return {
      ...stats,
      accuracy: stats.solved > 0 ? (stats.correct / stats.solved) * 100 : 0
    };
  }, [state.progress]);
  
  // 초기 로드
  useEffect(() => {
    if (userId) {
      loadProgress();
    }
  }, [userId, loadProgress]);
  
  return {
    // 상태
    ...state,
    
    // 액션
    loadProgress,
    recordAttempt,
    
    // 계산된 값들
    progressSummary: getProgressSummary(),
    completedAchievements: getCompletedAchievements(),
    inProgressAchievements: getInProgressAchievements(),
    
    // 유틸리티 함수들
    getProgressByCategory,
    getStatsByDifficulty
  };
}

// Mock 데이터 생성 함수들
function generateMockProgress(): LearningProgress[] {
  const categories: Category[] = ['algebra', 'geometry', 'calculus', 'statistics'];
  
  return categories.map((category, index) => ({
    id: `progress_${index}`,
    userId: 'user_1',
    category,
    totalProblems: 100 + Math.floor(Math.random() * 50),
    solvedProblems: 50 + Math.floor(Math.random() * 50),
    correctAnswers: 30 + Math.floor(Math.random() * 40),
    accuracyRate: 70 + Math.floor(Math.random() * 30),
    progressByDifficulty: {
      easy: {
        solved: 20 + Math.floor(Math.random() * 10),
        correct: 18 + Math.floor(Math.random() * 10),
        total: 30 + Math.floor(Math.random() * 10)
      },
      medium: {
        solved: 15 + Math.floor(Math.random() * 10),
        correct: 12 + Math.floor(Math.random() * 8),
        total: 25 + Math.floor(Math.random() * 10)
      },
      hard: {
        solved: 5 + Math.floor(Math.random() * 5),
        correct: 3 + Math.floor(Math.random() * 4),
        total: 15 + Math.floor(Math.random() * 10)
      }
    },
    totalStudyTime: 300 + Math.floor(Math.random() * 600), // 분 단위
    averageTimePerProblem: 5 + Math.floor(Math.random() * 10),
    lastActivityAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    currentStreak: Math.floor(Math.random() * 30),
    longestStreak: 10 + Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }));
}

function generateMockAchievements(): UserAchievement[] {
  const achievements = [
    {
      id: 'ach_1',
      title: '첫 문제 풀이',
      description: '첫 번째 문제를 해결했습니다',
      icon: 'star',
      category: 'problem_solving' as const,
      criteria: { type: 'count' as const, target: 1 },
      points: 10,
      rarity: 'common' as const,
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'ach_2',
      title: '연속 학습 7일',
      description: '7일 연속으로 문제를 풀었습니다',
      icon: 'calendar',
      category: 'streak' as const,
      criteria: { type: 'streak' as const, target: 7 },
      points: 50,
      rarity: 'rare' as const,
      isActive: true,
      createdAt: new Date()
    }
  ];
  
  return achievements.map((ach, index) => ({
    id: `user_ach_${index}`,
    userId: 'user_1',
    achievementId: ach.id,
    achievement: ach,
    currentProgress: Math.floor(Math.random() * ach.criteria.target * 1.2),
    targetProgress: ach.criteria.target,
    isCompleted: Math.random() > 0.5,
    completedAt: Math.random() > 0.5 ? new Date() : undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

function generateMockAttempts(): ProblemAttempt[] {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  
  return Array.from({ length: 10 }, (_, index) => ({
    id: `attempt_${index}`,
    userId: 'user_1',
    problemId: `problem_${index}`,
    userAnswer: `답안 ${index}`,
    isCorrect: Math.random() > 0.3,
    timeSpent: 60 + Math.floor(Math.random() * 300), // 초 단위
    attemptsCount: 1 + Math.floor(Math.random() * 3),
    hintsUsed: Math.random() > 0.5 ? [`hint_${index}`] : [],
    visualHintsViewed: Math.random() > 0.7 ? [`visual_${index}`] : [],
    status: 'completed' as const,
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    deviceType: Math.random() > 0.5 ? 'web' as const : 'mobile' as const,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }));
}