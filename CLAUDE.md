# CLAUDE.md

이 파일은 Claude Code가 GoMath 프로젝트에서 작업할 때 필요한 지침을 제공합니다.

## 프로젝트 개요

GoMath는 Visual Learning 기반의 수학 학습 플랫폼으로, 웹과 모바일 앱을 통해 기출문제 검색과 인터랙티브 시각화를 제공하는 통합 솔루션입니다.

## 기술 스택

### 프론트엔드
- **웹**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, D3.js, Three.js
- **모바일**: React Native + Expo, React Native Skia, React Native Reanimated
- **공통**: Apollo Client (GraphQL), 모노레포 아키텍처

### 백엔드
- **API**: Node.js + NestJS, GraphQL + REST
- **데이터베이스**: PostgreSQL, Redis
- **파일저장**: MinIO
- **AI/ML**: Python FastAPI (예정)

### 인프라
- **컨테이너**: Docker + Docker Compose
- **모노레포**: Turborepo
- **빌드도구**: TypeScript, ESLint, Prettier

## 개발 명령어

### 전체 프로젝트
```bash
# 의존성 설치
npm install

# 개발 서버 시작 (모든 앱)
npm run dev

# 개별 앱 실행
npm run dev:web    # 웹 (http://localhost:3000)
npm run dev:mobile # 모바일 (Expo)
npm run dev:api    # API (http://localhost:3001)

# 빌드
npm run build

# 테스트
npm run test

# 린트 및 타입 체크
npm run lint
npm run type-check
```

### Docker 개발 환경
```bash
# 데이터베이스 서비스 시작
docker-compose up -d postgres redis minio

# 전체 개발 환경
docker-compose up

# 특정 서비스만
docker-compose up web api
```

## 아키텍처 구조

```
gomath/
├── apps/
│   ├── web/                 # Next.js 웹 애플리케이션
│   ├── mobile/              # React Native + Expo 모바일 앱
│   └── api/                 # NestJS API 서버
├── packages/
│   ├── shared/              # 공통 타입, 유틸리티, 훅
│   └── ui/                  # 재사용 가능한 UI 컴포넌트
├── docker-compose.yml       # 개발 환경 설정
└── turbo.json              # Turborepo 설정
```

### 주요 패키지 역할

#### `@gomath/shared`
- 공통 TypeScript 타입 정의
- API 클라이언트 및 GraphQL 설정
- 비즈니스 로직 유틸리티
- React 훅 (useProblemSearch, useUserProgress)

#### `@gomath/ui`  
- 플랫폼 간 공유 UI 컴포넌트
- Visual Learning 시각화 컴포넌트
- MathProblemCard, MathGraph, GeometryCanvas

## 핵심 기능

### 1. 문제 검색 시스템
```typescript
// 공통 훅 사용 예제
import { useProblemSearch } from '@gomath/shared';

const { data, loading, searchProblems } = useProblemSearch({
  autoSearch: true,
  debounceMs: 300
});
```

### 2. Visual Learning 컴포넌트
```typescript
// 수학 그래프 시각화
import { MathGraph } from '@gomath/ui';

<MathGraph 
  functions={[
    { id: '1', expression: 'x^2', color: '#3b82f6', visible: true }
  ]}
  interactive
  showGrid
/>
```

### 3. 기하학적 시각화
```typescript
// 기하 도형 캔버스
import { GeometryCanvas } from '@gomath/ui';

<GeometryCanvas
  shapes={shapes}
  interactive
  onShapeClick={handleShapeClick}
/>
```

## 개발 워크플로

### 새로운 기능 추가
1. `packages/shared`에서 타입 정의
2. `packages/ui`에서 공통 컴포넌트 개발
3. `apps/web`과 `apps/mobile`에서 플랫폼별 구현
4. `apps/api`에서 백엔드 로직 구현

### 코드 품질
- TypeScript strict 모드 사용
- ESLint + Prettier 자동 포맷팅
- Zod를 사용한 런타임 타입 검증
- React Hook Form + Zod 폼 검증

## 환경 설정

### 필수 환경 변수
```bash
# .env 파일 생성 (예제에서 복사)
cp .env.example .env

# 주요 설정값들
DATABASE_URL=postgresql://gomath:gomath123@localhost:5432/gomath
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 데이터베이스
- PostgreSQL 15 사용
- Prisma ORM (예정) 또는 TypeORM
- Redis 캐싱

## 테스팅 전략

- **단위 테스트**: Jest + React Testing Library
- **통합 테스트**: API 엔드포인트 테스트
- **E2E 테스트**: Playwright (웹), Detox (모바일)
- **시각적 테스트**: Storybook + Chromatic

## 성능 최적화

### 웹
- Next.js SSR/SSG 활용
- 이미지 최적화 (next/image)
- 코드 스플리팅
- PWA 지원

### 모바일
- React Native Flipper 디버깅
- Hermes JavaScript 엔진
- 네이티브 모듈 최적화

## Visual Learning 아키텍처

### 웹 시각화 스택
- **D3.js**: 복잡한 데이터 시각화
- **Three.js**: 3D 수학 모델링
- **Framer Motion**: UI 애니메이션

### 모바일 시각화 스택
- **React Native Skia**: 고성능 2D 그래픽
- **React Native Reanimated**: 부드러운 애니메이션
- **React Native SVG**: 벡터 그래픽

## 문제 해결

### 일반적인 이슈
1. **모듈 해결 오류**: `npm install` 재실행
2. **포트 충돌**: docker-compose.yml에서 포트 변경
3. **타입 오류**: `npm run type-check` 실행
4. **빌드 실패**: 각 패키지를 순서대로 빌드

### 개발 도구
- **디버깅**: VS Code + 확장팩
- **DB 관리**: pgAdmin 또는 TablePlus
- **API 테스트**: Postman 또는 Thunder Client
- **GraphQL**: GraphQL Playground

## 배포 가이드

### 개발 환경
```bash
docker-compose up -d
```

### 프로덕션 빌드
```bash
# 전체 빌드
npm run build

# Docker 프로덕션 이미지
docker-compose -f docker-compose.prod.yml up -d
```

## 기여 가이드

1. 코드 작성 전 해당 패키지의 README.md 확인
2. 공통 타입은 `@gomath/shared`에 추가
3. UI 컴포넌트는 `@gomath/ui`에서 플랫폼 중립적으로 개발
4. 커밋 메시지는 conventional commits 형식 사용

이 프로젝트는 수학 교육의 혁신을 목표로 하는 Visual Learning 플랫폼입니다.