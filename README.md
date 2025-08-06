# GoMath - Visual Learning 수학 플랫폼

Visual Learning 기반의 수학 학습 플랫폼으로, 웹과 모바일 앱을 통해 기출문제 검색과 인터랙티브 시각화를 제공합니다.

## 🚀 주요 기능

### 📚 기출문제 검색 시스템
- 수능, 공무원, 모의고사 등 다양한 기출문제 데이터베이스
- 고급 검색 필터 (난이도, 카테고리, 연도, 출처)
- AI 기반 유사문제 추천

### 🎨 Visual Learning 시각화
- 인터랙티브 수학 그래프 (D3.js, Three.js)
- 기하학적 도형 시각화
- 단계별 문제 해결 과정 애니메이션
- 터치/마우스 기반 상호작용

### 📱 크로스 플랫폼 지원
- **웹**: Next.js 14 + React
- **모바일**: React Native + Expo
- **공통**: TypeScript + 모노레포 아키텍처

### 🤖 AI 기능
- 문제 자동 생성
- 개인맞춤 학습 경로 추천
- 카메라 기반 수식 인식 (모바일)

## 🏗️ 기술 스택

### Frontend
```
웹: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
모바일: React Native, Expo, React Native Reanimated
시각화: D3.js, Three.js, React Native Skia
상태관리: Apollo Client (GraphQL)
```

### Backend
```
API: Node.js, NestJS, GraphQL, REST
데이터베이스: PostgreSQL, Redis
파일저장: MinIO
인증: JWT, OAuth2
AI/ML: Python FastAPI, OpenAI API
```

### Infrastructure
```
컨테이너: Docker, Docker Compose
모노레포: Turborepo
CI/CD: GitHub Actions
배포: Kubernetes (선택사항)
```

## 📦 프로젝트 구조

```
gomath/
├── apps/
│   ├── web/                 # Next.js 웹 앱
│   ├── mobile/              # React Native 모바일 앱
│   └── api/                 # NestJS API 서버
├── packages/
│   ├── shared/              # 공통 타입, 유틸리티
│   └── ui/                  # 재사용 가능한 UI 컴포넌트
├── docker-compose.yml       # 개발 환경
├── turbo.json              # Turborepo 설정
└── package.json
```

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-org/gomath.git
cd gomath
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 실제 값으로 변경
```

### 3. 의존성 설치
```bash
npm install
```

### 4. 개발 환경 실행
```bash
# 데이터베이스 및 서비스 시작
docker-compose up -d postgres redis minio

# 모든 앱 개발 서버 시작
npm run dev

# 또는 개별 실행
npm run dev:web    # 웹 앱 (http://localhost:3000)
npm run dev:mobile # 모바일 앱 (Expo)
npm run dev:api    # API 서버 (http://localhost:3001)
```

### 5. 모바일 앱 실행 (Expo)
```bash
cd apps/mobile
npx expo start

# iOS 시뮬레이터
npx expo start --ios

# Android 에뮬레이터
npx expo start --android
```

## 🔧 개발 가이드

### 패키지 빌드
```bash
# 모든 패키지 빌드
npm run build

# 특정 패키지 빌드
npm run build --filter=@gomath/web
npm run build --filter=@gomath/api
```

### 테스트 실행
```bash
# 모든 테스트
npm run test

# 특정 패키지 테스트
npm run test --filter=@gomath/shared
```

### 코드 품질
```bash
# 린터 실행
npm run lint

# 타입 체크
npm run type-check

# 코드 포맷팅
npm run format
```

## 📚 API 문서

### REST API
- 개발: http://localhost:3001/api/docs
- 운영: https://api.gomath.app/docs

### GraphQL Playground
- 개발: http://localhost:3001/graphql
- 운영: https://api.gomath.app/graphql

## 🎨 UI 컴포넌트

UI 컴포넌트는 `packages/ui`에서 관리되며, 웹과 모바일에서 공통으로 사용 가능합니다.

### 주요 컴포넌트
- `MathProblemCard`: 문제 카드
- `MathGraph`: 함수 그래프 시각화
- `GeometryCanvas`: 기하학적 도형 캔버스

### Visual Learning 컴포넌트
```tsx
import { MathGraph } from '@gomath/ui';

function MyComponent() {
  const functions = [
    { id: '1', expression: 'x^2', color: '#3b82f6', visible: true }
  ];
  
  return <MathGraph functions={functions} interactive />;
}
```

## 🔄 상태 관리

### Apollo Client (GraphQL)
```tsx
import { useProblemSearch } from '@gomath/shared';

function ProblemList() {
  const { data, loading, searchProblems } = useProblemSearch({
    autoSearch: true
  });
  
  return (
    <div>
      {data?.problems.map(problem => (
        <MathProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
```

## 🚢 배포

### Docker를 사용한 배포
```bash
# 프로덕션 빌드
docker-compose -f docker-compose.prod.yml up -d

# 개별 서비스 배포
docker build -t gomath/api -f apps/api/Dockerfile .
docker build -t gomath/web -f apps/web/Dockerfile .
```

### 환경별 설정
- **개발**: `docker-compose.yml`
- **스테이징**: `docker-compose.staging.yml`
- **운영**: `docker-compose.prod.yml`

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 과정 또는 보조 도구 변경
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🆘 지원

- 📧 이메일: support@gomath.app
- 💬 Discord: [GoMath Community](https://discord.gg/gomath)
- 🐛 버그 리포트: [GitHub Issues](https://github.com/your-org/gomath/issues)
- 📖 문서: [GoMath Docs](https://docs.gomath.app)

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - 웹 프레임워크
- [React Native](https://reactnative.dev/) - 모바일 프레임워크
- [NestJS](https://nestjs.com/) - 백엔드 프레임워크
- [D3.js](https://d3js.org/) - 데이터 시각화
- [Turborepo](https://turbo.build/) - 모노레포 도구

---

**GoMath Team과 함께 수학을 더 쉽고 재미있게 만들어보세요!** 🎓✨