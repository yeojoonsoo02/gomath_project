/**
 * API 클라이언트 기본 설정
 * Apollo Client 및 REST API 클라이언트 통합
 */

// GraphQL 스키마 타입 (임시)
export interface GraphQLResponse<T = any> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

// REST API 기본 설정
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// 기본 API 클라이언트 클래스
export class ApiClient {
  private config: ApiClientConfig;
  private token: string | null = null;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  setAuthToken(token: string | null) {
    this.token = token;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.config.headers, ...customHeaders };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  private buildUrl(url: string, params?: Record<string, any>): string {
    const fullUrl = `${this.config.baseURL}${url}`;
    
    if (!params) return fullUrl;
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }

  async request<T = any>(config: RequestConfig): Promise<T> {
    const { method, url, params, data, headers: customHeaders, timeout } = config;
    
    const requestUrl = method === 'GET' ? this.buildUrl(url, params) : `${this.config.baseURL}${url}`;
    const headers = this.getHeaders(customHeaders);
    
    const requestConfig: RequestInit = {
      method,
      headers,
      signal: timeout ? AbortSignal.timeout(timeout) : AbortSignal.timeout(this.config.timeout),
    };
    
    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        requestConfig.body = data;
        // FormData는 자동으로 Content-Type 설정
        delete headers['Content-Type'];
      } else {
        requestConfig.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      }
    }
    
    try {
      const response = await fetch(requestUrl, requestConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }
      
      // 응답이 JSON이 아닐 수 있음 (예: 파일 다운로드)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      } else {
        return response as unknown as T;
      }
      
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('요청 시간이 초과되었습니다.', 408, 'TIMEOUT');
        }
        throw new ApiError(error.message, 0, 'NETWORK_ERROR');
      }
      
      throw new ApiError('알 수 없는 오류가 발생했습니다.', 0, 'UNKNOWN_ERROR');
    }
  }

  // HTTP 메서드 편의 함수들
  get<T = any>(url: string, params?: Record<string, any>, headers?: Record<string, string>) {
    return this.request<T>({ method: 'GET', url, params, headers });
  }

  post<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  put<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>({ method: 'PUT', url, data, headers });
  }

  patch<T = any>(url: string, data?: any, headers?: Record<string, string>) {
    return this.request<T>({ method: 'PATCH', url, data, headers });
  }

  delete<T = any>(url: string, headers?: Record<string, string>) {
    return this.request<T>({ method: 'DELETE', url, headers });
  }
}

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 기본 API 클라이언트 인스턴스 생성 함수
export function createApiClient(baseURL?: string): ApiClient {
  const config: ApiClientConfig = {
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  return new ApiClient(config);
}

// Apollo Client 설정 (GraphQL용)
export function createApolloClientConfig(uri?: string) {
  // 실제 Apollo Client 설정은 각 플랫폼에서 구현
  return {
    uri: uri || process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql',
    cache: {
      typePolicies: {
        MathProblem: {
          fields: {
            visualHints: {
              merge(existing = [], incoming: any[]) {
                return incoming;
              },
            },
          },
        },
        UserProgress: {
          fields: {
            progressByDifficulty: {
              merge(existing = {}, incoming: any) {
                return { ...existing, ...incoming };
              },
            },
          },
        },
      },
    },
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
  };
}

// 인터셉터 타입 정의
export interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: any) => any;
  onRejected?: (error: any) => any;
}

// 확장된 API 클라이언트 (인터셉터 지원)
export class ExtendedApiClient extends ApiClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  async request<T = any>(config: RequestConfig): Promise<T> {
    // 요청 인터셉터 적용
    let processedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }

    try {
      let response = await super.request<T>(processedConfig);
      
      // 성공 응답 인터셉터 적용
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onFulfilled) {
          response = await interceptor.onFulfilled(response);
        }
      }
      
      return response;
    } catch (error) {
      // 에러 응답 인터셉터 적용
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          error = await interceptor.onRejected(error);
        }
      }
      throw error;
    }
  }
}

// 기본 인터셉터들
export const authInterceptor: RequestInterceptor = (config) => {
  // 토큰 자동 갱신 로직 등
  return config;
};

export const errorHandlingInterceptor: ResponseInterceptor = {
  onRejected: (error) => {
    // 전역 에러 처리 로직
    console.error('API Error:', error);
    return Promise.reject(error);
  },
};

// 기본 확장 API 클라이언트 생성
export function createExtendedApiClient(baseURL?: string): ExtendedApiClient {
  const config: ApiClientConfig = {
    baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  
  const client = new ExtendedApiClient(config);
  
  // 기본 인터셉터 추가
  client.addRequestInterceptor(authInterceptor);
  client.addResponseInterceptor(errorHandlingInterceptor);
  
  return client;
}