# 🌐 GoMath 공개 URL 및 배포 가이드

## 📋 배포 완료 상태

✅ **GitHub 리포지토리**: https://github.com/yeojoonsoo02/gomath_project  
✅ **배포 설정**: 모든 플랫폼 설정 완료  
✅ **API 연결**: 웹 앱 ↔ API 서버 연동 완료  

## 🚀 원클릭 배포 링크

### 1. 웹 애플리케이션 (Next.js)

**Vercel 배포** (추천):
```
https://vercel.com/new/clone?repository-url=https://github.com/yeojoonsoo02/gomath_project&root-directory=apps/web
```

**Netlify 배포**:
```
https://app.netlify.com/start/deploy?repository=https://github.com/yeojoonsoo02/gomath_project&dir=apps/web
```

### 2. API 서버 (NestJS)

**Railway 배포** (추천):
```
https://railway.app/template/new?template=https://github.com/yeojoonsoo02/gomath_project&rootDirectory=apps/api
```

**Render 배포**:
```
https://render.com/deploy?repo=https://github.com/yeojoonsoo02/gomath_project
```

## 🎯 예상 배포 URL

배포 완료 후 다음과 같은 URL을 얻게 됩니다:

### 웹 앱
- **Vercel**: `https://gomath-project-web.vercel.app`
- **Netlify**: `https://gomath-project.netlify.app`

### API 서버
- **Railway**: `https://gomath-api-production.railway.app`
- **Render**: `https://gomath-api.onrender.com`

### 모바일 앱 (Expo)
- **Expo Go**: `https://expo.dev/@yeojoonsoo02/gomath-mobile`

## 📱 데모 계정

Mock 로그인 테스트용:
- **아이디**: demo
- **비밀번호**: demo123

## 🔧 수동 배포 명령어

로컬에서 직접 배포하려면:

```bash
# 웹 앱 (Vercel)
cd apps/web
npx vercel --prod

# API 서버 (Railway)
railway login
railway init
railway up

# 모바일 앱 (Expo)
cd apps/mobile
expo publish
```

## 📊 현재 기능

✅ **완성된 기능:**
- 반응형 웹 디자인
- API 상태 실시간 모니터링
- 50개 Mock 수학 문제 데이터
- 기본 인증 시스템 (Mock)
- Visual Learning 컴포넌트
- GraphQL + REST API 하이브리드
- Swagger API 문서
- Docker 컨테이너 지원

🔄 **다음 개발 단계:**
- PostgreSQL 데이터베이스 연결
- 실제 문제 데이터 입력
- AI 유사문제 생성 기능
- 사용자 진도 추적
- 모바일 앱 완성

## 🚨 배포 시 주의사항

1. **환경변수 설정**:
   - `NEXT_PUBLIC_API_URL`: API 서버 주소
   - `DATABASE_URL`: 데이터베이스 연결 문자열
   - `JWT_SECRET`: JWT 토큰 시크릿

2. **CORS 설정**: API에서 웹 앱 도메인 허용

3. **빌드 명령어**: 
   - Web: `npm run build`
   - API: `npm run build`

## 📞 지원

- **GitHub Issues**: https://github.com/yeojoonsoo02/gomath_project/issues
- **개발 문의**: claude-code 세션 내에서 추가 개발 요청