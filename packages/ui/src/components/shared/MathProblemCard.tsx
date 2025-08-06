import React from 'react';
import { MathProblem } from '@gomath/shared';
import { formatDifficulty, formatCategory, formatRelativeTime } from '@gomath/shared';
import { cn } from '../../utils/cn';

interface MathProblemCardProps {
  problem: MathProblem;
  onView?: (problem: MathProblem) => void;
  onBookmark?: (problem: MathProblem) => void;
  isBookmarked?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * 수학 문제 카드 컴포넌트
 * 웹과 모바일에서 공통으로 사용할 수 있도록 설계
 */
export function MathProblemCard({
  problem,
  onView,
  onBookmark,
  isBookmarked = false,
  className,
  variant = 'default'
}: MathProblemCardProps) {
  const getDifficultyColor = (difficulty: MathProblem['difficulty']) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty] || colors.medium;
  };

  const handleCardClick = () => {
    onView?.(problem);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(problem);
  };

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'bg-white rounded-lg border border-gray-200 p-4 cursor-pointer',
          'hover:shadow-md hover:-translate-y-1 transition-all duration-200',
          'active:scale-[0.98]',
          className
        )}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{problem.title}</h3>
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border',
              getDifficultyColor(problem.difficulty)
            )}
          >
            {formatDifficulty(problem.difficulty)}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{formatCategory(problem.category)}</span>
          {problem.year && <span>{problem.year}년</span>}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'bg-white rounded-xl border border-gray-200 p-6 cursor-pointer',
          'hover:shadow-lg hover:-translate-y-1 transition-all duration-200',
          'active:scale-[0.98]',
          className
        )}
        onClick={handleCardClick}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {problem.title}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>{formatCategory(problem.category)}</span>
              {problem.source && problem.year && (
                <span>{problem.year}년 {problem.source}</span>
              )}
              {problem.estimatedTime && (
                <span>⏱ {problem.estimatedTime}분</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium border',
                getDifficultyColor(problem.difficulty)
              )}
            >
              {formatDifficulty(problem.difficulty)}
            </span>
            <button
              onClick={handleBookmarkClick}
              className={cn(
                'p-2 rounded-full transition-colors',
                isBookmarked
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              )}
              aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
            >
              <BookmarkIcon className="w-5 h-5" filled={isBookmarked} />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        {problem.content && (
          <div className="mb-4">
            <p className="text-gray-600 line-clamp-3">{problem.content}</p>
          </div>
        )}

        {/* Tags */}
        {problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {problem.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
            {problem.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                +{problem.tags.length - 3}개
              </span>
            )}
          </div>
        )}

        {/* Visual Hints Indicator */}
        {problem.visualHints.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-blue-600 mb-4">
            <EyeIcon className="w-4 h-4" />
            <span>{problem.visualHints.length}개의 시각적 힌트</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{problem.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4" />
              <span>{problem.likeCount}</span>
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {formatRelativeTime(problem.updatedAt)}
          </span>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 cursor-pointer',
        'hover:shadow-md hover:-translate-y-1 transition-all duration-200',
        'active:scale-[0.98]',
        className
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">
          {problem.title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0',
              getDifficultyColor(problem.difficulty)
            )}
          >
            {formatDifficulty(problem.difficulty)}
          </span>
          <button
            onClick={handleBookmarkClick}
            className={cn(
              'p-1 rounded transition-colors flex-shrink-0',
              isBookmarked
                ? 'text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            )}
            aria-label={isBookmarked ? '북마크 제거' : '북마크 추가'}
          >
            <BookmarkIcon className="w-4 h-4" filled={isBookmarked} />
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-2">
          <span>{formatCategory(problem.category)}</span>
          {problem.source && problem.year && (
            <span>• {problem.year}년</span>
          )}
        </div>
        {problem.estimatedTime && (
          <span>⏱ {problem.estimatedTime}분</span>
        )}
      </div>

      {/* Tags */}
      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {problem.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {problem.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
              +{problem.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Visual Hints */}
      {problem.visualHints.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-blue-600">
          <EyeIcon className="w-3 h-3" />
          <span>{problem.visualHints.length}개 힌트</span>
        </div>
      )}
    </div>
  );
}

// Icon Components (간단한 SVG 아이콘들)
function BookmarkIcon({ className, filled }: { className: string; filled?: boolean }) {
  if (filled) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
    </svg>
  );
}

function EyeIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function HeartIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}