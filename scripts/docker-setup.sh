#!/bin/bash
# Docker 기반 base (web + db) 설정 및 실행 스크립트

set -e
cd "$(dirname "$0")/.."   # kit/ 루트로 이동

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── 도커 설치 확인 ───────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  echo -e "${RED}❌ Docker가 설치되어 있지 않습니다.${NC}"
  echo "   https://docs.docker.com/get-docker/ 에서 설치 후 다시 실행하세요."
  exit 1
fi

if ! docker info &>/dev/null 2>&1; then
  echo -e "${RED}❌ Docker 데몬이 실행 중이지 않습니다.${NC}"
  echo "   Docker Desktop을 실행한 후 다시 시도하세요."
  exit 1
fi

echo -e "${GREEN}✅ Docker 확인 완료${NC}"

# ── .env 확인 ────────────────────────────────────────────────
if [ ! -f "launch-kit/.env" ]; then
  echo ""
  echo -e "${YELLOW}⚠️  launch-kit/.env 파일이 없습니다. 기본값으로 생성합니다...${NC}"
  cp launch-kit/.env.example launch-kit/.env 2>/dev/null || cat > launch-kit/.env << 'EOF'
DATABASE_URL="postgresql://kituser:kitpassword@db:5432/kit_dev"
NEXTAUTH_SECRET="dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
KAKAO_CLIENT_ID=""
KAKAO_CLIENT_SECRET=""
NAVER_CLIENT_ID=""
NAVER_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF
  echo -e "${GREEN}✅ launch-kit/.env 생성됨${NC}"
  echo -e "${YELLOW}   OAuth 키가 있다면 launch-kit/.env 파일을 수정하세요.${NC}"
fi

# ── 기존 컨테이너 정리 ───────────────────────────────────────
echo ""
echo "🧹 기존 컨테이너 정리..."
docker compose down --remove-orphans 2>/dev/null || true

# ── 빌드 & 실행 ──────────────────────────────────────────────
echo ""
echo "🔨 Docker 이미지 빌드 중..."
docker compose build

echo ""
echo "🚀 컨테이너 시작 중..."
docker compose up -d

# ── 상태 확인 ────────────────────────────────────────────────
echo ""
echo "⏳ 서비스 준비 대기 중..."
MAX_WAIT=60
ELAPSED=0
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login 2>/dev/null | grep -q "200\|307"; do
  sleep 3
  ELAPSED=$((ELAPSED + 3))
  if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo -e "${YELLOW}⚠️  타임아웃 — 로그를 확인하세요: docker compose logs -f web${NC}"
    break
  fi
  echo "  대기 중... (${ELAPSED}s)"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Docker 실행 완료!${NC}"
echo ""
echo "  🌐 웹 (base-web):  http://localhost:3000"
echo "  🗄️  DB  (base-db):  localhost:5432 (kituser / kitpassword / kit_dev)"
echo ""
echo "유용한 명령어:"
echo "  docker compose logs -f        # 전체 로그"
echo "  docker compose logs -f web    # 웹 로그만"
echo "  docker compose logs -f db     # DB 로그만"
echo "  docker compose down           # 종료"
echo "  docker compose restart web    # 웹 재시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
