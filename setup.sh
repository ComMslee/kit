#!/bin/bash
# Kit 전체 초기 설정 스크립트

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧰 Kit 보일러플레이트 초기 설정"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "실행 방식을 선택하세요:"
echo ""
echo "  1) 🐳 도커  (추천 — PostgreSQL + 웹 + API 한번에 실행)"
echo "  2) 💻 웹 로컬  (apps/web 직접 실행, DB 별도 필요)"
echo "  3) 📱 모바일   (apps/mobile — Expo 로컬 실행)"
echo "  4) 🐳+📱   (도커 웹 + 모바일 동시 설정)"
echo ""
read -p "선택 (1/2/3/4): " CHOICE

case "$CHOICE" in
  1)
    echo ""
    echo -e "${CYAN}── 도커 설정 시작 ──${NC}"
    bash scripts/docker-setup.sh
    ;;
  2)
    echo ""
    echo -e "${CYAN}── 웹 로컬 설정 시작 ──${NC}"
    bash scripts/web-setup.sh
    ;;
  3)
    echo ""
    echo -e "${CYAN}── 모바일 설정 시작 ──${NC}"
    bash scripts/mobile-setup.sh
    ;;
  4)
    echo ""
    echo -e "${CYAN}── 도커 설정 시작 ──${NC}"
    bash scripts/docker-setup.sh
    echo ""
    echo -e "${CYAN}── 모바일 설정 시작 ──${NC}"
    bash scripts/mobile-setup.sh
    ;;
  *)
    echo -e "${RED}잘못된 선택입니다.${NC}"
    exit 1
    ;;
esac
