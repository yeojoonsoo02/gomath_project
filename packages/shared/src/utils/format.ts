import { Difficulty, Category, Source } from '../types/problem';

/**
 * 난이도를 한국어로 변환
 */
export function formatDifficulty(difficulty: Difficulty): string {
  const difficultyMap: Record<Difficulty, string> = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움'
  };
  return difficultyMap[difficulty];
}

/**
 * 카테고리를 한국어로 변환
 */
export function formatCategory(category: Category): string {
  const categoryMap: Record<Category, string> = {
    algebra: '대수',
    geometry: '기하',
    calculus: '미적분',
    statistics: '확률과 통계',
    functions: '함수',
    trigonometry: '삼각함수',
    vectors: '벡터',
    matrices: '행렬',
    sequences: '수열',
    limits: '극한'
  };
  return categoryMap[category];
}

/**
 * 출처를 한국어로 변환
 */
export function formatSource(source: Source): string {
  const sourceMap: Record<Source, string> = {
    suneung: '수능',
    mock_exam: '모의고사',
    previous_exam: '기출문제',
    practice: '연습문제',
    competition: '경시대회',
    textbook: '교과서'
  };
  return sourceMap[source];
}

/**
 * 시간을 읽기 좋은 형태로 변환
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}분`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}시간`;
  }
  
  return `${hours}시간 ${remainingMinutes}분`;
}

/**
 * 정확도를 퍼센트로 변환
 */
export function formatAccuracy(correct: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = Math.round((correct / total) * 100);
  return `${percentage}%`;
}

/**
 * 숫자를 읽기 좋은 형태로 변환 (1,234)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 날짜를 상대적 시간으로 변환
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 1) {
    return '방금 전';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  } else {
    return `${diffInYears}년 전`;
  }
}

/**
 * 날짜를 한국어 형식으로 변환
 */
export function formatDate(date: Date, includeTime = false): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return date.toLocaleDateString('ko-KR', options);
}

/**
 * 파일 크기를 읽기 좋은 형태로 변환
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 연속 학습일 형식화
 */
export function formatStreak(days: number): string {
  if (days === 0) return '연속 학습 시작!';
  return `${days}일 연속`;
}

/**
 * 성취도 진행률을 퍼센트로 변환
 */
export function formatProgress(current: number, target: number): string {
  if (target === 0) return '0%';
  const percentage = Math.min(100, Math.round((current / target) * 100));
  return `${percentage}%`;
}

/**
 * LaTeX 수식을 렌더링 가능한 형태로 변환
 * (실제 LaTeX 렌더링은 각 플랫폼에서 처리)
 */
export function formatLatex(latex: string): string {
  // 기본적인 LaTeX 정리
  return latex.trim();
}

/**
 * 태그를 읽기 좋은 형태로 변환
 */
export function formatTags(tags: string[]): string {
  if (tags.length === 0) return '';
  if (tags.length === 1) return tags[0];
  if (tags.length <= 3) return tags.join(', ');
  return `${tags.slice(0, 2).join(', ')} 외 ${tags.length - 2}개`;
}