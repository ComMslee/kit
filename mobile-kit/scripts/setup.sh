#!/bin/bash
# mobile-kit 초기 설정 스크립트

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "📱 mobile-kit 설정을 시작합니다..."
echo ""

# 1. 환경변수 설정
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  .env 파일이 없습니다. 아래 내용으로 생성합니다...${NC}"
  cat > .env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_KAKAO_CLIENT_ID=
EXPO_PUBLIC_NAVER_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EOF
  echo -e "${GREEN}✅ .env 파일 생성됨${NC}"
  echo -e "${YELLOW}   실제 키가 있다면 .env 파일을 수정해주세요.${NC}"
else
  echo -e "${GREEN}✅ .env 파일이 이미 존재합니다.${NC}"
fi

# 2. 의존성 설치
echo ""
echo "📦 의존성을 설치합니다..."
npm install
echo -e "${GREEN}✅ 의존성 설치 완료${NC}"

# 3. Expo 설치 확인
if ! command -v expo &>/dev/null && ! npx expo --version &>/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Expo CLI가 없습니다. 전역 설치를 권장합니다:${NC}"
  echo "   npm install -g expo-cli"
fi

# 4. 완료
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 설정 완료!${NC}"
echo ""
echo "실기기 테스트 (권장):"
echo "  npx expo start"
echo "  → 폰에 Expo Go 앱 설치 후 QR 코드 스캔"
echo ""
echo "시뮬레이터:"
echo "  npx expo start --ios      # Xcode 필요"
echo "  npx expo start --android  # Android Studio 필요"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "지금 바로 Expo 개발 서버를 시작할까요? (y/N) " START_EXPO
if [[ "$START_EXPO" =~ ^[Yy]$ ]]; then
  npx expo start
fi
