# ── 개발용 Dockerfile (모노레포) ─────────────────────────────
# 빌드 컨텍스트: 레포 루트 (kit/)
# 소스는 docker-compose.yml 의 볼륨 마운트로 핫 리로드
FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# ── 루트 & 패키지 매니페스트 복사 (레이어 캐싱) ──────────────
COPY package*.json turbo.json ./
COPY packages/types/package*.json ./packages/types/
COPY packages/db/package*.json ./packages/db/
COPY apps/api/package*.json ./apps/api/

RUN npm install

# ── Prisma 클라이언트 생성 ─────────────────────────────────
COPY packages/db/prisma ./packages/db/prisma
RUN cd packages/db && npx prisma generate --schema=./prisma/schema.prisma

# ── 나머지 소스 복사 (볼륨 마운트로 덮어써짐) ────────────────
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

WORKDIR /workspace/apps/api

EXPOSE 4000

CMD ["npm", "run", "dev"]
