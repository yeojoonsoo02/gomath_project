import { useState, useCallback, useEffect } from 'react';
import { 
  ProblemFilter, 
  ProblemSearchResult, 
  MathProblem 
} from '../types/problem';

interface ProblemSearchState {
  data: ProblemSearchResult | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

interface ProblemSearchOptions {
  autoSearch?: boolean;
  debounceMs?: number;
}

/**
 * 문제 검색을 위한 커스텀 훅
 * 웹과 모바일에서 공통으로 사용
 */
export function useProblemSearch(
  initialFilter?: Partial<ProblemFilter>,
  options: ProblemSearchOptions = {}
) {
  const { autoSearch = false, debounceMs = 300 } = options;
  
  const [state, setState] = useState<ProblemSearchState>({
    data: null,
    loading: false,
    error: null,
    hasSearched: false
  });
  
  const [filter, setFilter] = useState<ProblemFilter>({
    page: 1,
    limit: 20,
    sortBy: 'relevance',
    sortOrder: 'desc',
    ...initialFilter
  });
  
  // 검색 실행 함수
  const searchProblems = useCallback(async (searchFilter?: Partial<ProblemFilter>) => {
    const finalFilter = { ...filter, ...searchFilter };
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: 실제 API 호출 구현
      // const response = await problemApi.search(finalFilter);
      
      // 임시 Mock 데이터
      await new Promise(resolve => setTimeout(resolve, 500)); // API 지연 시뮬레이션
      
      const mockData: ProblemSearchResult = {
        problems: generateMockProblems(finalFilter.limit || 20),
        total: 150,
        page: finalFilter.page || 1,
        totalPages: Math.ceil(150 / (finalFilter.limit || 20)),
        hasNext: (finalFilter.page || 1) * (finalFilter.limit || 20) < 150,
        hasPrevious: (finalFilter.page || 1) > 1
      };
      
      setState(prev => ({
        ...prev,
        data: mockData,
        loading: false,
        hasSearched: true
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.',
        loading: false,
        hasSearched: true
      }));
    }
  }, [filter]);
  
  // 필터 업데이트 함수
  const updateFilter = useCallback((updates: Partial<ProblemFilter>) => {
    setFilter(prev => ({
      ...prev,
      ...updates,
      // 페이지는 새로운 검색 시 1로 리셋
      page: updates.query !== undefined || updates.categories !== undefined ? 1 : (updates.page || prev.page)
    }));
  }, []);
  
  // 다음 페이지 로드
  const loadNextPage = useCallback(() => {
    if (state.data?.hasNext) {
      updateFilter({ page: (filter.page || 1) + 1 });
    }
  }, [state.data?.hasNext, filter.page, updateFilter]);
  
  // 이전 페이지 로드
  const loadPrevPage = useCallback(() => {
    if (state.data?.hasPrevious && (filter.page || 1) > 1) {
      updateFilter({ page: (filter.page || 1) - 1 });
    }
  }, [state.data?.hasPrevious, filter.page, updateFilter]);
  
  // 검색 초기화
  const resetSearch = useCallback(() => {
    setFilter({
      page: 1,
      limit: 20,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
    setState({
      data: null,
      loading: false,
      error: null,
      hasSearched: false
    });
  }, []);
  
  // 자동 검색 및 디바운싱
  useEffect(() => {
    if (!autoSearch) return;
    
    const timer = setTimeout(() => {
      if (filter.query || filter.categories?.length || filter.tags?.length) {
        searchProblems();
      }
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [filter, autoSearch, debounceMs, searchProblems]);
  
  return {
    // 상태
    ...state,
    filter,
    
    // 액션
    searchProblems,
    updateFilter,
    loadNextPage,
    loadPrevPage,
    resetSearch,
    
    // 편의 함수들
    setQuery: (query: string) => updateFilter({ query }),
    setCategories: (categories: ProblemFilter['categories']) => updateFilter({ categories }),
    setDifficulties: (difficulties: ProblemFilter['difficulties']) => updateFilter({ difficulties }),
    setSources: (sources: ProblemFilter['sources']) => updateFilter({ sources }),
    setTags: (tags: string[]) => updateFilter({ tags }),
    setSortBy: (sortBy: ProblemFilter['sortBy']) => updateFilter({ sortBy }),
    setSortOrder: (sortOrder: ProblemFilter['sortOrder']) => updateFilter({ sortOrder })
  };
}

// Mock 데이터 생성 함수
function generateMockProblems(count: number): MathProblem[] {
  const categories = ['algebra', 'geometry', 'calculus', 'statistics'] as const;
  const difficulties = ['easy', 'medium', 'hard'] as const;
  const sources = ['suneung', 'mock_exam', 'practice'] as const;
  
  return Array.from({ length: count }, (_, index) => ({
    id: `problem_${index + 1}`,
    title: `수학 문제 ${index + 1}`,
    content: `이것은 ${index + 1}번째 문제입니다.`,
    solution: `해답: ${Math.floor(Math.random() * 100)}`,
    explanation: '이 문제는 다음과 같이 해결할 수 있습니다...',
    category: categories[Math.floor(Math.random() * categories.length)],
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    tags: [`태그${index + 1}`, `수학`],
    source: sources[Math.floor(Math.random() * sources.length)],
    year: 2020 + Math.floor(Math.random() * 4),
    visualHints: [],
    estimatedTime: 10 + Math.floor(Math.random() * 20),
    points: 3 + Math.floor(Math.random() * 5),
    keywords: ['수학', '문제'],
    relatedConcepts: ['기초개념'],
    isPublic: true,
    isVerified: true,
    viewCount: Math.floor(Math.random() * 1000),
    likeCount: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }));
}