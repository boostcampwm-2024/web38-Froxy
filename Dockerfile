FROM docker:20.10.7-dind

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./
RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm lint --filter=backend && pnpm turbo run build --filter=backend

WORKDIR /app/apps/backend
CMD ["pnpm", "run", "start:prod"]

# 외부에서 접근할 수 있도록 포트 노출
EXPOSE 3000
