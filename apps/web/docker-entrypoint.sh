#!/bin/sh
set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐳 base-web 컨테이너 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Prisma 클라이언트 재생성 (packages/db 스키마 기준)
echo "🔧 Prisma 클라이언트 생성..."
cd /workspace/packages/db && npx prisma generate --schema=./prisma/schema.prisma

# DB 스키마 동기화 (마이그레이션 없이 스키마 즉시 반영)
echo "🗄️  DB 스키마 동기화..."
npx prisma db push --schema=./prisma/schema.prisma --accept-data-loss 2>&1 | tail -3
cd /workspace/apps/web

echo ""
echo "✅ 준비 완료 — 개발 서버 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

exec npm run dev
