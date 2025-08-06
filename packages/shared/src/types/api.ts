import { z } from 'zod';

// API 응답 기본 타입
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.date().optional(),
  requestId: z.string().optional()
});

// 성공 응답
export const ApiSuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  ApiResponseSchema.extend({
    success: z.literal(true),
    data: dataSchema
  });

// 에러 응답
export const ApiErrorResponseSchema = ApiResponseSchema.extend({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
    field: z.string().optional()
  })
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  timestamp?: Date;
  requestId?: string;
};

// 페이지네이션
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().min(0),
  totalPages: z.number().min(0),
  hasNext: z.boolean(),
  hasPrevious: z.boolean()
});
export type Pagination = z.infer<typeof PaginationSchema>;

// 페이지네이션된 응답
export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema
  });

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

// 정렬 옵션
export const SortOrderSchema = z.enum(['asc', 'desc']);
export type SortOrder = z.infer<typeof SortOrderSchema>;

export const SortOptionSchema = z.object({
  field: z.string(),
  order: SortOrderSchema.default('asc')
});
export type SortOption = z.infer<typeof SortOptionSchema>;

// 필터 기본 타입
export const BaseFilterSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z.array(SortOptionSchema).optional(),
  search: z.string().optional()
});
export type BaseFilter = z.infer<typeof BaseFilterSchema>;

// HTTP 상태 코드
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// API 에러 코드
export const ApiErrorCode = {
  // 인증/인가
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  
  // 검증
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_FIELD: 'MISSING_FIELD',
  
  // 리소스
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_LIMIT_EXCEEDED: 'RESOURCE_LIMIT_EXCEEDED',
  
  // 비즈니스 로직
  PROBLEM_NOT_ACCESSIBLE: 'PROBLEM_NOT_ACCESSIBLE',
  ALREADY_ATTEMPTED: 'ALREADY_ATTEMPTED',
  ATTEMPT_LIMIT_EXCEEDED: 'ATTEMPT_LIMIT_EXCEEDED',
  
  // 시스템
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  
  // 파일/업로드
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED'
} as const;

export type ApiErrorCodeType = typeof ApiErrorCode[keyof typeof ApiErrorCode];

// API 엔드포인트 타입
export const ApiEndpoint = {
  // 인증
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_LOGOUT: '/auth/logout',
  
  // 사용자
  USER_PROFILE: '/users/profile',
  USER_UPDATE_PROFILE: '/users/profile',
  USER_PROGRESS: '/users/progress',
  USER_ACHIEVEMENTS: '/users/achievements',
  USER_BOOKMARKS: '/users/bookmarks',
  
  // 문제
  PROBLEMS_SEARCH: '/problems/search',
  PROBLEMS_DETAIL: '/problems/:id',
  PROBLEMS_SIMILAR: '/problems/:id/similar',
  PROBLEMS_ATTEMPT: '/problems/:id/attempt',
  PROBLEMS_BOOKMARK: '/problems/:id/bookmark',
  
  // 시각화
  VISUALIZATION_GENERATE: '/visualization/generate',
  VISUALIZATION_SAVE: '/visualization/save',
  
  // AI
  AI_GENERATE_SIMILAR: '/ai/generate-similar',
  AI_EXPLAIN: '/ai/explain',
  AI_HINT: '/ai/hint'
} as const;

export type ApiEndpointType = typeof ApiEndpoint[keyof typeof ApiEndpoint];