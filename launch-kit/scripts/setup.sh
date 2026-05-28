#!/bin/bash
# launch-kit 초기 설정 스크립트

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "🚀 launch-kit 설정을 시작합니다..."
echo ""

# 1. 환경변수 설정
if [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  .env 파일이 생성되었습니다.${NC}"
    echo -e "${YELLOW}   .env 파일을 열어 아래 항목을 채워주세요:${NC}"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET  (openssl rand -base64 32)"
    echo "   - KAKAO/NAVER/GOOGLE 클라이언트 키"
    echo ""
    read -p "   .env 수정을 완료했으면 Enter를 누르세요..."
  else
    echo -e "${RED}❌ .env.example 파일을 찾을 수 없습니다.${NC}"
    exit 1
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

# 4. DB 마이그레이션
echo ""
echo "🗄️  DB 마이그레이션을 실행합니다..."
echo -e "${YELLOW}   PostgreSQL이 실행 중이고 DATABASE_URL이 설정되어 있어야 합니다.${NC}"

if npx prisma migrate dev --name init 2>/dev/null; then
  echo -e "${GREEN}✅ DB 마이그레이션 완료${NC}"
else
  echo -e "${YELLOW}⚠️  DB 마이그레이션을 건너뜁니다. (DB 미연결 또는 이미 최신 상태)${NC}"
  echo "   나중에 수동으로 실행: npx prisma migrate dev --name init"
fi

# 5. 완료
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 설정 완료!${NC}"
echo ""
echo "개발 서버 시작:"
echo "  npm run dev"
echo ""
echo "접속 주소: http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "지금 바로 개발 서버를 시작할까요? (y/N) " START_SERVER
if [[ "$START_SERVER" =~ ^[Yy]$ ]]; then
  npm run dev
fi
