# ── 개발용 Dockerfile (모노레포) ─────────────────────────────
# 빌드 컨텍스트: 레포 루트 (kit/)
# 소스는 docker-compose.yml 의 볼륨 마운트로 핫 리로드
# alpine 대신 debian slim 사용 — lightningcss arm64 musl 바이너리 호환성 문제 방지
FROM node:22-slim

# Prisma 생성에 필요한 OpenSSL 설치
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# ── 루트 & 패키지 매니페스트 복사 (레이어 캐싱) ──────────────
COPY package*.json turbo.json ./
COPY packages/types/package*.json ./packages/types/
COPY packages/db/package*.json ./packages/db/
COPY apps/web/package*.json ./apps/web/

# 전체 워크스페이스 의존성 설치 (npm install로 현재 플랫폼 바이너리 자동 해결)
RUN npm install && \
    # lightningcss 플랫폼 바이너리 위치 수정 (npm workspace 호이스팅 불일치 방지)
    # lightningcss는 apps/web/node_modules에 위치하지만 바이너리는 루트에 호이스팅됨
    for pkg in lightningcss-linux-arm64-gnu lightningcss-linux-arm64-musl lightningcss-linux-x64-gnu lightningcss-linux-x64-musl; do \
        if [ -d "/workspace/node_modules/$pkg" ] && [ ! -e "/workspace/apps/web/node_modules/$pkg" ]; then \
            ln -s "/workspace/node_modules/$pkg" "/workspace/apps/web/node_modules/$pkg"; \
        fi; \
    done

# ── Prisma 스키마 복사 & 클라이언트 생성 ─────────────────────
COPY packages/db/prisma ./packages/db/prisma
RUN cd packages/db && npx prisma generate --schema=./prisma/schema.prisma

# ── 나머지 소스 복사 (볼륨 마운트로 덮어써짐) ────────────────
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

WORKDIR /workspace/apps/web

EXPOSE 3000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
