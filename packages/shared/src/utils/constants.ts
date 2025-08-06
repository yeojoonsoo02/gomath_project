import { Category, Difficulty, Source, VisualHintType } from '../types/problem';
import { UserRole, LearningLevel } from '../types/user';

/**
 * 카테고리 정보 (한국어 포함)
 */
export const CATEGORIES: Record<Category, { ko: string; en: string; icon: string }> = {
  algebra: { ko: '대수', en: 'Algebra', icon: 'calculator' },
  geometry: { ko: '기하', en: 'Geometry', icon: 'shapes' },
  calculus: { ko: '미적분', en: 'Calculus', icon: 'trending-up' },
  statistics: { ko: '확률과 통계', en: 'Statistics', icon: 'bar-chart' },
  functions: { ko: '함수', en: 'Functions', icon: 'activity' },
  trigonometry: { ko: '삼각함수', en: 'Trigonometry', icon: 'triangle' },
  vectors: { ko: '벡터', en: 'Vectors', icon: 'arrow-up-right' },
  matrices: { ko: '행렬', en: 'Matrices', icon: 'grid' },
  sequences: { ko: '수열', en: 'Sequences', icon: 'list' },
  limits: { ko: '극한', en: 'Limits', icon: 'target' }
};

/**
 * 난이도 정보
 */
export const DIFFICULTIES: Record<Difficulty, { 
  ko: string; 
  en: string; 
  color: string;
  bgColor: string;
  order: number;
}> = {
  easy: { 
    ko: '쉬움', 
    en: 'Easy', 
    color: '#10b981',
    bgColor: '#d1fae5',
    order: 1 
  },
  medium: { 
    ko: '보통', 
    en: 'Medium', 
    color: '#f59e0b',
    bgColor: '#fef3c7',
    order: 2 
  },
  hard: { 
    ko: '어려움', 
    en: 'Hard', 
    color: '#ef4444',
    bgColor: '#fee2e2',
    order: 3 
  }
};

/**
 * 출처 정보
 */
export const SOURCES: Record<Source, { ko: string; en: string; icon: string }> = {
  suneung: { ko: '수능', en: 'CSAT', icon: 'book-open' },
  mock_exam: { ko: '모의고사', en: 'Mock Exam', icon: 'file-text' },
  previous_exam: { ko: '기출문제', en: 'Previous Exam', icon: 'archive' },
  practice: { ko: '연습문제', en: 'Practice', icon: 'edit' },
  competition: { ko: '경시대회', en: 'Competition', icon: 'award' },
  textbook: { ko: '교과서', en: 'Textbook', icon: 'book' }
};

/**
 * 시각적 힌트 타입 정보
 */
export const VISUAL_HINT_TYPES: Record<VisualHintType, {
  ko: string;
  en: string;
  icon: string;
  description: string;
}> = {
  graph: {
    ko: '그래프',
    en: 'Graph',
    icon: 'trending-up',
    description: '함수나 데이터를 시각적 그래프로 표현'
  },
  diagram: {
    ko: '도형',
    en: 'Diagram',
    icon: 'shapes',
    description: '기하학적 도형과 관계 시각화'
  },
  animation: {
    ko: '애니메이션',
    en: 'Animation',
    icon: 'play-circle',
    description: '동적 변화 과정을 애니메이션으로 표현'
  },
  interactive: {
    ko: '인터랙티브',
    en: 'Interactive',
    icon: 'mouse-pointer',
    description: '사용자가 직접 조작할 수 있는 요소'
  },
  step_by_step: {
    ko: '단계별 해설',
    en: 'Step by Step',
    icon: 'list',
    description: '문제 해결 과정을 단계별로 안내'
  },
  formula: {
    ko: '공식 시각화',
    en: 'Formula Visualization',
    icon: 'type',
    description: '수학 공식과 기호를 명확하게 표현'
  }
};

/**
 * 사용자 역할 정보
 */
export const USER_ROLES: Record<UserRole, { ko: string; en: string; permissions: string[] }> = {
  student: {
    ko: '학생',
    en: 'Student',
    permissions: ['view_problems', 'solve_problems', 'save_bookmarks', 'view_progress']
  },
  teacher: {
    ko: '교사',
    en: 'Teacher',
    permissions: [
      'view_problems', 'solve_problems', 'save_bookmarks', 'view_progress',
      'create_problems', 'edit_problems', 'view_student_progress'
    ]
  },
  admin: {
    ko: '관리자',
    en: 'Admin',
    permissions: [
      'view_problems', 'solve_problems', 'save_bookmarks', 'view_progress',
      'create_problems', 'edit_problems', 'view_student_progress',
      'manage_users', 'manage_system', 'view_analytics'
    ]
  }
};

/**
 * 학습 레벨 정보
 */
export const LEARNING_LEVELS: Record<LearningLevel, {
  ko: string;
  en: string;
  description: string;
  color: string;
  order: number;
}> = {
  beginner: {
    ko: '초급',
    en: 'Beginner',
    description: '기초 개념을 학습 중인 단계',
    color: '#10b981',
    order: 1
  },
  intermediate: {
    ko: '중급',
    en: 'Intermediate',
    description: '기본 문제를 해결할 수 있는 단계',
    color: '#3b82f6',
    order: 2
  },
  advanced: {
    ko: '고급',
    en: 'Advanced',
    description: '복잡한 문제도 해결할 수 있는 단계',
    color: '#8b5cf6',
    order: 3
  },
  expert: {
    ko: '전문가',
    en: 'Expert',
    description: '모든 문제를 해결할 수 있는 단계',
    color: '#f59e0b',
    order: 4
  }
};

/**
 * 기본 설정값
 */
export const DEFAULT_SETTINGS = {
  PROBLEMS_PER_PAGE: 20,
  MAX_SEARCH_RESULTS: 100,
  MAX_BOOKMARKS: 1000,
  MAX_FILE_SIZE_MB: 10,
  MAX_TAGS_PER_PROBLEM: 10,
  MAX_TAG_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  DISPLAY_NAME_MAX_LENGTH: 50,
  SEARCH_QUERY_MIN_LENGTH: 2,
  SEARCH_QUERY_MAX_LENGTH: 100,
  SESSION_TIMEOUT_MINUTES: 30,
  REFRESH_TOKEN_EXPIRES_DAYS: 30,
  ACCESS_TOKEN_EXPIRES_MINUTES: 15
} as const;

/**
 * 허용된 파일 타입
 */
export const ALLOWED_FILE_TYPES = {
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt'],
  AUDIO: ['mp3', 'wav', 'ogg'],
  VIDEO: ['mp4', 'webm', 'mov']
} as const;

/**
 * 성취도 카테고리
 */
export const ACHIEVEMENT_CATEGORIES = {
  PROBLEM_SOLVING: 'problem_solving',
  STREAK: 'streak',
  ACCURACY: 'accuracy',
  TIME: 'time',
  SPECIAL: 'special'
} as const;

/**
 * 성취도 희귀도
 */
export const ACHIEVEMENT_RARITY = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
} as const;

/**
 * API 응답 상태
 */
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading'
} as const;

/**
 * 테마 타입
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const;

/**
 * 지원 언어
 */
export const SUPPORTED_LANGUAGES = {
  KOREAN: 'ko',
  ENGLISH: 'en',
  JAPANESE: 'ja',
  CHINESE: 'zh'
} as const;

/**
 * 디바이스 타입
 */
export const DEVICE_TYPES = {
  WEB: 'web',
  MOBILE: 'mobile',
  TABLET: 'tablet'
} as const;

/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'gomath_access_token',
  REFRESH_TOKEN: 'gomath_refresh_token',
  USER_PROFILE: 'gomath_user_profile',
  USER_SETTINGS: 'gomath_user_settings',
  SEARCH_HISTORY: 'gomath_search_history',
  THEME: 'gomath_theme',
  LANGUAGE: 'gomath_language'
} as const;