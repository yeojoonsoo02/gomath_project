import { z } from 'zod';

// 문제 난이도 타입
export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export type Difficulty = z.infer<typeof DifficultySchema>;

// 문제 카테고리 타입
export const CategorySchema = z.enum([
  'algebra',       // 대수
  'geometry',      // 기하
  'calculus',      // 미적분
  'statistics',    // 확률과 통계
  'functions',     // 함수
  'trigonometry',  // 삼각함수
  'vectors',       // 벡터
  'matrices',      // 행렬
  'sequences',     // 수열
  'limits'         // 극한
]);
export type Category = z.infer<typeof CategorySchema>;

// 문제 출처 타입
export const SourceSchema = z.enum([
  'suneung',       // 수능
  'mock_exam',     // 모의고사
  'previous_exam', // 기출문제
  'practice',      // 연습문제
  'competition',   // 경시대회
  'textbook'       // 교과서
]);
export type Source = z.infer<typeof SourceSchema>;

// 시각적 힌트 타입
export const VisualHintTypeSchema = z.enum([
  'graph',         // 그래프
  'diagram',       // 도형
  'animation',     // 애니메이션
  'interactive',   // 인터랙티브
  'step_by_step',  // 단계별 해설
  'formula'        // 공식 시각화
]);
export type VisualHintType = z.infer<typeof VisualHintTypeSchema>;

// 시각적 힌트 스키마
export const VisualHintSchema = z.object({
  id: z.string(),
  type: VisualHintTypeSchema,
  title: z.string(),
  description: z.string(),
  content: z.object({
    // 그래프 데이터 (D3.js, Three.js용)
    graphData: z.any().optional(),
    // 애니메이션 설정
    animationConfig: z.object({
      duration: z.number(),
      easing: z.string(),
      steps: z.array(z.any())
    }).optional(),
    // 인터랙티브 요소 설정
    interactiveElements: z.array(z.object({
      type: z.string(),
      position: z.object({ x: z.number(), y: z.number() }),
      properties: z.any()
    })).optional(),
    // 공식 LaTeX 문자열
    latex: z.string().optional(),
    // 추가 메타데이터
    metadata: z.record(z.any()).optional()
  }),
  isVisible: z.boolean().default(true),
  order: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});
export type VisualHint = z.infer<typeof VisualHintSchema>;

// 문제 스키마
export const MathProblemSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(), // 문제 내용 (LaTeX 포함)
  solution: z.string().optional(), // 해답 (LaTeX 포함)
  explanation: z.string().optional(), // 상세 해설
  
  // 분류 정보
  category: CategorySchema,
  subcategory: z.string().optional(),
  difficulty: DifficultySchema,
  tags: z.array(z.string()).default([]),
  
  // 출처 정보
  source: SourceSchema,
  year: z.number().optional(),
  examName: z.string().optional(),
  questionNumber: z.string().optional(),
  
  // 시각적 힌트
  visualHints: z.array(VisualHintSchema).default([]),
  
  // 메타데이터
  estimatedTime: z.number().optional(), // 예상 소요 시간 (분)
  points: z.number().optional(), // 배점
  keywords: z.array(z.string()).default([]),
  relatedConcepts: z.array(z.string()).default([]),
  
  // 상태 정보
  isPublic: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  viewCount: z.number().default(0),
  likeCount: z.number().default(0),
  
  // 타임스탬프
  createdAt: z.date(),
  updatedAt: z.date(),
  
  // 작성자 정보
  authorId: z.string().optional(),
  authorName: z.string().optional()
});
export type MathProblem = z.infer<typeof MathProblemSchema>;

// 문제 검색 필터
export const ProblemFilterSchema = z.object({
  query: z.string().optional(),
  categories: z.array(CategorySchema).optional(),
  difficulties: z.array(DifficultySchema).optional(),
  sources: z.array(SourceSchema).optional(),
  tags: z.array(z.string()).optional(),
  yearRange: z.object({
    start: z.number(),
    end: z.number()
  }).optional(),
  hasVisualHints: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'difficulty', 'date', 'popularity']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().default(1),
  limit: z.number().default(20)
});
export type ProblemFilter = z.infer<typeof ProblemFilterSchema>;

// 문제 검색 결과
export const ProblemSearchResultSchema = z.object({
  problems: z.array(MathProblemSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean()
});
export type ProblemSearchResult = z.infer<typeof ProblemSearchResultSchema>;