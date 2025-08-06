import { Injectable } from '@nestjs/common';
import { 
  UserProfile, 
  LearningProgress, 
  UserAchievement, 
  BookmarkedProblem,
  Category,
  LearningLevel 
} from '@gomath/shared';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  // Mock 사용자 프로필
  getMockProfile(): UserProfile {
    return {
      id: 'user_1',
      email: 'student@gomath.app',
      username: 'mathstudent',
      displayName: '김수학',
      avatar: 'https://via.placeholder.com/100',
      role: 'student',
      level: 'intermediate',
      grade: 11,
      school: '서울고등학교',
      preferredCategories: ['algebra', 'calculus'],
      preferredDifficulty: 'medium',
      learningGoals: ['수능 수학 고득점', '미적분 완전 정복'],
      settings: {
        emailNotifications: true,
        pushNotifications: true,
        visualHintsEnabled: true,
        language: 'ko',
        theme: 'system'
      },
      isActive: true,
      isVerified: true,
      lastLoginAt: new Date(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    };
  }

  async updateProfile(updateDto: UpdateUserDto): Promise<UserProfile> {
    const currentProfile = this.getMockProfile();
    
    // 실제로는 데이터베이스 업데이트
    return {
      ...currentProfile,
      ...updateDto,
      updatedAt: new Date(),
    };
  }

  getMockProgress(): LearningProgress[] {
    const categories: Category[] = ['algebra', 'geometry', 'calculus', 'statistics'];
    
    return categories.map((category, index) => ({
      id: `progress_${index}`,
      userId: 'user_1',
      category,
      totalProblems: 50 + Math.floor(Math.random() * 50),
      solvedProblems: 20 + Math.floor(Math.random() * 30),
      correctAnswers: 15 + Math.floor(Math.random() * 25),
      accuracyRate: 70 + Math.floor(Math.random() * 30),
      progressByDifficulty: {
        easy: {
          solved: 15 + Math.floor(Math.random() * 10),
          correct: 12 + Math.floor(Math.random() * 8),
          total: 20 + Math.floor(Math.random() * 10)
        },
        medium: {
          solved: 10 + Math.floor(Math.random() * 10),
          correct: 8 + Math.floor(Math.random() * 6),
          total: 18 + Math.floor(Math.random() * 10)
        },
        hard: {
          solved: 3 + Math.floor(Math.random() * 5),
          correct: 2 + Math.floor(Math.random() * 3),
          total: 12 + Math.floor(Math.random() * 8)
        }
      },
      totalStudyTime: 120 + Math.floor(Math.random() * 300),
      averageTimePerProblem: 5 + Math.floor(Math.random() * 10),
      lastActivityAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      currentStreak: Math.floor(Math.random() * 20),
      longestStreak: 10 + Math.floor(Math.random() * 40),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    }));
  }

  getMockAchievements(): UserAchievement[] {
    const achievements = [
      {
        id: 'ach_1',
        title: '첫 발걸음',
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
        title: '꾸준히 학습',
        description: '7일 연속으로 문제를 풀었습니다',
        icon: 'calendar',
        category: 'streak' as const,
        criteria: { type: 'streak' as const, target: 7 },
        points: 50,
        rarity: 'rare' as const,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: 'ach_3',
        title: '정확도 마스터',
        description: '정확도 90% 이상을 달성했습니다',
        icon: 'target',
        category: 'accuracy' as const,
        criteria: { type: 'percentage' as const, target: 90 },
        points: 100,
        rarity: 'epic' as const,
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

  getMockBookmarks(): BookmarkedProblem[] {
    return Array.from({ length: 5 }, (_, index) => ({
      id: `bookmark_${index}`,
      userId: 'user_1',
      problemId: `problem_${index + 1}`,
      tags: ['중요', '복습필요'],
      notes: `문제 ${index + 1}에 대한 개인 메모`,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
  }

  async addBookmark(problemId: string): Promise<BookmarkedProblem> {
    return {
      id: `bookmark_${Date.now()}`,
      userId: 'user_1',
      problemId,
      tags: [],
      createdAt: new Date(),
    };
  }
}