#!/bin/bash

echo "🚀 GoMath 빠른 배포 스크립트"
echo "================================"

# 1. Vercel에 웹 앱 배포
echo "📱 웹 앱 배포 중..."
cd apps/web
npm run build
npx vercel --prod --yes
cd ../..

# 2. Railway에 API 배포 (optional)
if command -v railway &> /dev/null; then
    echo "🔧 API 서버 배포 중..."
    railway login
    railway link
    railway up
else
    echo "⚠️ Railway CLI가 설치되지 않았습니다."
    echo "   npm install -g @railway/cli 로 설치하세요."
fi

# 3. Expo에 모바일 앱 퍼블리시
echo "📱 모바일 앱 퍼블리시 중..."
cd apps/mobile
if command -v expo &> /dev/null; then
    expo publish --non-interactive
else
    echo "⚠️ Expo CLI가 설치되지 않았습니다."
    echo "   npm install -g @expo/cli 로 설치하세요."
fi
cd ../..

echo "✅ 배포 완료!"
echo "🌐 웹: Vercel 대시보드에서 URL 확인"
echo "📱 모바일: Expo 대시보드에서 확인"