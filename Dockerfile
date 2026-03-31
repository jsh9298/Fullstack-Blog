# 1단계: 빌드 (Build Stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 실행 (Runner Stage)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 빌드 결과물 중 실행에 필요한 것만 쏙 골라 담기 (용량 최적화)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 🚀 Drizzle 마이그레이션을 위해 추가로 복사해야 할 것들
COPY --from=builder /app/drizzle.config.ts ./     
COPY --from=builder /app/drizzle ./drizzle          
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json 


EXPOSE 3000
CMD ["node", "server.js"]
