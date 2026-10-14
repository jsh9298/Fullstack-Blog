# 1단계: 빌드 (Build Stage)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npm run build

RUN npm prune --production

# 2단계: 실행 (Runner Stage)
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# 빌드 결과물 및 Drizzle 마이그레이션에 필요한 것만
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json 
COPY --from=builder /app/drizzle.config.ts ./     
COPY --from=builder /app/drizzle ./drizzle          
COPY --from=builder /app/src ./src

# RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]
