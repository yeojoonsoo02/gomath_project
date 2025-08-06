# GoMath 배포 가이드

## 🚀 빠른 배포 방법

### 1. 웹 앱 배포 (Vercel)

**단계별 배포:**

1. **Vercel에 로그인**
   ```bash
   vercel login
   ```

2. **웹 앱 배포**
   ```bash
   cd apps/web
   vercel --prod
   ```

3. **환경변수 설정** (Vercel 대시보드에서)
   - `NEXT_PUBLIC_API_URL`: API 서버 URL

### 2. API 서버 배포 (Railway)

1. **Railway 계정 생성** → https://railway.app
2. **GitHub 연결** 또는 **직접 업로드**
3. **apps/api** 디렉토리 선택
4. **자동 배포** 완료

### 3. 모바일 앱 퍼블리시 (Expo)

1. **Expo 계정 생성** → https://expo.dev
2. **앱 퍼블리시**
   ```bash
   cd apps/mobile
   expo publish
   ```

## 🌐 퍼블릭 URL 예시

배포 후 다음과 같은 URL을 얻을 수 있습니다:

- **웹 앱**: `https://gomath-web-xyz123.vercel.app`
- **API 서버**: `https://gomath-api-xyz123.railway.app`
- **모바일 앱**: `https://expo.dev/@username/gomath-mobile`

## ⚡ 원클릭 배포 옵션

### Vercel (웹 앱)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/gomath-project&root-directory=apps/web)

### Railway (API)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/your-username/gomath-project&rootDirectory=apps/api)

### Netlify (웹 앱 대안)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/gomath-project&dir=apps/web)

## 🔧 로컬 개발 서버 실행

```bash
# 전체 프로젝트 실행
npm run dev

# 개별 서비스 실행
npm run dev:web     # 웹 앱 (포트 3000)
npm run dev:api     # API 서버 (포트 3001)
npm run dev:mobile  # 모바일 앱 (Expo)
```

## 📋 체크리스트

배포 전 확인사항:

- [ ] 모든 환경변수 설정 완료
- [ ] API 엔드포인트 URL 업데이트
- [ ] 도메인 및 CORS 설정 확인
- [ ] 데이터베이스 연결 설정 완료
- [ ] SSL 인증서 설정 (자동)

## 🎯 현재 상태

✅ **완료된 기능:**
- 웹 앱 UI 및 API 연결
- NestJS API 서버 (Mock 데이터)
- 기본 인증 시스템
- Visual Learning 컴포넌트
- 반응형 디자인

⏳ **진행 중:**
- 실제 데이터베이스 연결
- 프로덕션 배포 설정
- CI/CD 파이프라인

🔄 **다음 단계:**
- 사용자 피드백 수집
- 성능 최적화
- 추가 기능 개발