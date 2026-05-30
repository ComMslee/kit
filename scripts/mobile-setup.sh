#!/bin/bash
# apps/mobile 초기 설정 스크립트

set -e
cd "$(dirname "$0")/.."   # kit/ 루트로 이동

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "📱 apps/mobile 설정을 시작합니다..."
echo ""

# 1. 환경변수 설정
if [ ! -f "apps/mobile/.env" ]; then
  if [ -f "apps/mobile/.env.example" ]; then
    cp apps/mobile/.env.example apps/mobile/.env
    echo -e "${GREEN}✅ apps/mobile/.env 생성됨 (.env.example 복사)${NC}"
  else
    cat > apps/mobile/.env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:4000
EXPO_PUBLIC_KAKAO_CLIENT_ID=
EXPO_PUBLIC_NAVER_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EOF
    echo -e "${GREEN}✅ apps/mobile/.env 생성됨${NC}"
  fi
  echo -e "${YELLOW}   실제 키가 있다면 apps/mobile/.env 파일을 수정해주세요.${NC}"
else
  echo -e "${GREEN}✅ apps/mobile/.env 파일이 이미 존재합니다.${NC}"
fi

# 2. 의존성 설치
echo ""
echo "📦 의존성을 설치합니다..."
cd apps/mobile && npm install && cd ../..
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
echo "이후 실행은 루트 scripts/mobile-start.sh 사용:"
echo "  ./scripts/mobile-start.sh              # QR 기본 모드"
echo "  ./scripts/mobile-start.sh --ios        # iOS 시뮬레이터"
echo "  ./scripts/mobile-start.sh --android    # Android 에뮬레이터"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "지금 바로 Expo 개발 서버를 시작할까요? (y/N) " START_EXPO
if [[ "$START_EXPO" =~ ^[Yy]$ ]]; then
  bash scripts/mobile-start.sh
fi
