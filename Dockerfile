FROM node:20

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
