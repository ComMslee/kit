#!/bin/bash
# Kit 전체 초기 설정 스크립트

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧰 Kit 보일러플레이트 초기 설정"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "어떤 프로젝트를 설정할까요?"
echo "  1) 웹만  (launch-kit)"
echo "  2) 앱만  (mobile-kit)"
echo "  3) 둘 다 (web + mobile)"
echo ""
read -p "선택 (1/2/3): " CHOICE

case "$CHOICE" in
  1)
    echo ""
    echo -e "${CYAN}── launch-kit 설정 시작 ──${NC}"
    cd launch-kit
    bash scripts/setup.sh
    ;;
  2)
    echo ""
    echo -e "${CYAN}── mobile-kit 설정 시작 ──${NC}"
    cd mobile-kit
    bash scripts/setup.sh
    ;;
  3)
    echo ""
    echo -e "${CYAN}── launch-kit 설정 시작 ──${NC}"
    (cd launch-kit && bash scripts/setup.sh)
    echo ""
    echo -e "${CYAN}── mobile-kit 설정 시작 ──${NC}"
    (cd mobile-kit && bash scripts/setup.sh)
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}🎉 전체 설정 완료!${NC}"
    echo ""
    echo "다음 단계:"
    echo "  웹:  cd launch-kit && npm run dev"
    echo "  앱:  cd mobile-kit && npx expo start"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    ;;
  *)
    echo "잘못된 선택입니다."
    exit 1
    ;;
esac
