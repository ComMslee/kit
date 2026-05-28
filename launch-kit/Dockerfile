# ── 개발용 Dockerfile ────────────────────────────────────────
# 소스는 docker-compose.yml 의 볼륨 마운트로 핫 리로드
FROM node:22-alpine

WORKDIR /app

# 의존성 설치 (레이어 캐싱 — package.json 변경 시만 재설치)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Prisma 클라이언트 생성
RUN npx prisma generate

# 나머지 소스 복사 (볼륨 마운트로 덮어써짐)
COPY . .

EXPOSE 3000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
