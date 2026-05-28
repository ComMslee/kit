#!/bin/bash
# mobile-kit 개발 서버 시작 스크립트

set -e
cd "$(dirname "$0")/.."   # kit/ 루트로 이동

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ── 의존성 확인 ──────────────────────────────────────────────
if [ ! -d "mobile-kit/node_modules" ]; then
  echo -e "${YELLOW}⚠️  node_modules 없음 — 먼저 설치합니다...${NC}"
  (cd mobile-kit && npm install)
fi

# ── .env 확인 ────────────────────────────────────────────────
if [ ! -f "mobile-kit/.env" ]; then
  echo -e "${YELLOW}⚠️  mobile-kit/.env 없음 — 기본값으로 생성합니다...${NC}"
  cat > mobile-kit/.env << 'EOF'
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_KAKAO_CLIENT_ID=
EXPO_PUBLIC_NAVER_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
EOF
  echo -e "${GREEN}✅ mobile-kit/.env 생성됨${NC}"
fi

# ── 실행 모드 선택 ───────────────────────────────────────────
MODE=${1:-""}   # 인수 없으면 기본 QR 모드

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 mobile-kit 개발 서버 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

case "$MODE" in
  --ios)
    echo "🍎 iOS 시뮬레이터로 시작 (Xcode 필요)"
    cd mobile-kit && npx expo start --ios
    ;;
  --android)
    echo "🤖 Android 에뮬레이터로 시작 (Android Studio 필요)"
    cd mobile-kit && npx expo start --android
    ;;
  --tunnel)
    echo "🌐 터널 모드로 시작 (다른 Wi-Fi 환경 or ngrok)"
    cd mobile-kit && npx expo start --tunnel
    ;;
  --web)
    echo "🌐 웹 브라우저로 시작"
    cd mobile-kit && npx expo start --web
    ;;
  *)
    echo ""
    echo "  📲 폰에서 접속:"
    echo "     1. Expo Go 앱 설치 (App Store / Play Store)"
    echo "     2. QR 코드 스캔 (iOS: 기본 카메라 / Android: Expo Go 내 스캔)"
    echo "     ※ 맥과 폰이 같은 Wi-Fi에 있어야 합니다"
    echo ""
    echo "  다른 모드:"
    echo "     ./scripts/mobile-start.sh --ios      # iOS 시뮬레이터"
    echo "     ./scripts/mobile-start.sh --android  # Android 에뮬레이터"
    echo "     ./scripts/mobile-start.sh --tunnel   # 다른 Wi-Fi 환경"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    cd mobile-kit && npx expo start
    ;;
esac
