FROM docker:dind

RUN apk add --no-cache nodejs npm python3 make g++ bash

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm lint --filter=backend && pnpm turbo run build --filter=backend

WORKDIR /app/apps/backend
CMD ["pnpm", "run", "start:prod"]

# 외부에서 접근할 수 있도록 포트 노출
EXPOSE 3000
