#!/bin/bash
# launch-kit 로컬(비도커) 초기 설정 스크립트
# 도커 방식은 루트의 scripts/docker-setup.sh 또는 setup.sh 사용

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🚀 launch-kit 로컬 설정을 시작합니다..."
echo -e "${YELLOW}   💡 도커 방식을 원하면: cd .. && bash setup.sh${NC}"
echo ""

# 1. 환경변수 설정
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  .env 파일이 생성되었습니다.${NC}"
    echo -e "${YELLOW}   아래 항목을 채워주세요:${NC}"
    echo "   - DATABASE_URL (로컬 PostgreSQL 주소)"
    echo "   - NEXTAUTH_SECRET  (openssl rand -base64 32)"
    echo "   - OAuth 클라이언트 키"
    echo ""
    read -p "   .env 수정을 완료했으면 Enter를 누르세요..."
  fi
else
  echo -e "${GREEN}✅ .env 파일이 이미 존재합니다.${NC}"
fi

# 2. 의존성 설치
echo ""
echo "📦 의존성을 설치합니다..."
npm install
echo -e "${GREEN}✅ 의존성 설치 완료${NC}"

# 3. Prisma 클라이언트 생성
echo ""
echo "🔧 Prisma 클라이언트를 생성합니다..."
npx prisma generate
echo -e "${GREEN}✅ Prisma 클라이언트 생성 완료${NC}"

# 4. DB 스키마 동기화
echo ""
echo "🗄️  DB 스키마 동기화..."
echo -e "${YELLOW}   PostgreSQL이 실행 중이어야 합니다.${NC}"

if npx prisma db push --accept-data-loss 2>/dev/null; then
  echo -e "${GREEN}✅ DB 스키마 동기화 완료${NC}"
else
  echo -e "${YELLOW}⚠️  DB 동기화 스킵 (나중에: npx prisma db push)${NC}"
fi

# 5. 완료
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 설정 완료!${NC}"
echo ""
echo "  개발 서버 시작:  npm run dev"
echo "  접속:            http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "지금 바로 개발 서버를 시작할까요? (y/N) " START_SERVER
if [[ "$START_SERVER" =~ ^[Yy]$ ]]; then
  npm run dev
fi
